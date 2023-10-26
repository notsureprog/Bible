import React from 'react'
import parse from 'html-react-parser';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Platform, FlatList } from 'react-native'
import axios from 'axios'
import store from '../app/store'
// import HTMLView from 'react-native-htmlview'
import { HTMLElementModel, CSSPropertyNameList, CSSProcessorConfig, TRenderEngineProvider, RenderHTML, HTMLContentModel, RenderHTMLConfigProvider } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
// import * as scriptureStyles from '../../css/scriptureConverted'
// import * as scriptureStyles from '../../css/scriptureConverted'
import DropDownPicker from 'react-native-dropdown-picker'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { EXPO_PUBLIC_API_URL, BIBLE_API_KEY, REACT_APP_EXPRESS_URL } from '@env'
import VersionSelectMenu from '../../VersionSelectMenu'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { selectVerse } from '../features/verse/verseSlice'
import { converted } from '../../css/scriptureConverted'
// import { putVerseInDatabase } from '../../database/db'
// import * as scriptureStyles from '../../css/scripture.css'

import { useDispatch, useSelector } from 'react-redux'
// import { BulkWriteResult } from 'mongodb';
// import { putVerseInDatabase } from '../../database/db'

// https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/chapters/PSA.1/verses

// https://www.w3schools.com/react/react_jsx.asp
/*
JSX stands for JavaScript XML.

JSX allows us to write HTML in React.

JSX makes it easier to write and add HTML in React.

IT IS THE MOBILE PLATFORMS THAT MAKE THIS A BIT MORE CHALLENGING... WITH HTML THAT IS...
*/

// idk if theyre all spans
// data-sid is in the db when i click the verse however it needs to be converted to, for example, LEV.5.2 instead of LEV 5:2
// https://github.com/meliorence/react-native-render-html/blob/v6.3.1/packages/render-html/src/TNodeRenderer.tsx

// Example of what I am Thinking - <${css}><${html}></${css}>

console.log(BIBLE_API_KEY)
console.log(VersionSelectMenu)
console.log(store.getState())
// const Props = () => {
//     RenderHTMLProps
// }
const BibleScreen = ({ navigation, route }) => {
    const verse = useSelector((state) => state.authenticate.verseReducer)
    console.log(verse)
    const dispatch = useDispatch()

    const fontReducer = (state, action) => {
        if (action.type === "INCREASE_FONT") {
            return {
                size: state.size + 2
            }
        }
        if (action.type === "DECREASE_FONT") {
            return {
                size: state.size - 2
            }
        }
        if (action.type === "RESET") {
            return {
                size: 12
            }
        }
    }

    // const verseReducer = (state, action) => {

    //     if (action.type === "POST_VERSE") {
    //         return {
    //             ...state,

    //         }
    //     }
    // }
    // }


    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode;
    const [fontState, fontDispatch] = React.useReducer(fontReducer, { size: 24 })
    const [chapter, setChapter] = React.useState(route.params.chapter !== undefined ? route.params.chapter : 'GEN.1');
    console.log(chapter)
    const [view, setView] = React.useState(`chapter`)
    const [bible, setBible] = React.useState(route.params.version !== undefined ? route.params.version : 'de4e12af7f28f599-01');

    console.log(bible)
    const [data, setData] = React.useState(0);
    const [parsed, setParsed] = React.useState(null)

    if (data !== null) {
        console.log(Object.values(data)) //array... I will use this for the highlighted verses as reference
        // const element = document.getElementsByClassName('span')
        // console.log(element)
    }

    const customHTMLElementModels = {
        'dynamic-font': HTMLElementModel.fromCustomModel({
            tagName: 'dynamic-font',
            element: RenderHTML,

            mixedUAStyles: {
                color: darkMode ? styles.dark.color : styles.light.color,
                fontSize: fontState.size,
                // converted
            },

            contentModel: HTMLContentModel.mixed
        })
    }

    const allowedStyles = {
        fontWeight: 'bold'
    }



    const GetVerse = async () => {
        try {
            const options = {
                method: 'GET',
                // // https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/chapters/PSA.1/verses
                url: view === 'chapter' ? `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}` : `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}/verses`,
                headers: {
                    'api-key': `${BIBLE_API_KEY}`
                }
            }

            const result = await axios(options);
            // console.log(parse(JSON.stringify(result.data.data)))
            setParsed(parse(JSON.stringify(result.data.data)))
            console.log(result.data.data); //not an array
            setData(result.data.data);
            // parse(result.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    const RenderParsed = () => {
        // I will have to merge possibly
        let tags = [] //this one will have tags
        let verses = []
        let allData = []
        if (parsed !== null) {
            console.log(parsed) //array...
            for (var i = 0; i < parsed.length; i++) {
                if (i !== 0 && i !== parsed.length - 1) {
                    parsed[i].props.children.map((result) => {
                        // data-number is definetly the verse
                        // every even data element has a type (tag/class) result.data.type
                        // every odd element is text on result.data
                        // There has to be a simple way...
                        verses.push({ data: result, verse: i, chapter: data.id })
                    })
                }
            }
            console.log(verses)
        }



        // console.log(allData.length)
        // for (var j = 0; j < allData.length; j++) {
        //     if (allData.length % 2 !== 0) {
        //         verses.push({ data: allData[j]})
        //     }
        // }
        return (
            // <Text>Hi</Text>
            <FlatList
                data={verses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    // console.log(item.data)
                    // if item.length % 2 === 0 then we need to apply styles and tags. every even data type has a className and children (not all have data-number though)
                    // if item.length % 2 !== 0 then we need to render text. every odd one has just data to worry about
                    <View>
                        {item.length % 2 === 0 &&
                            <View>
                                <Text>jljfjaljfljaskfjaljfaljfajfajfajldfjalfj</Text>
                                {/* I need this to tell which verse it is... and it will have to be a numerical props.children... with Number(props.children)...since, for example, some of the children are "LORD" */}
                                {/* <Pressable onPress={() => console.log(item.data.data.props.children)}>
                                    <Text>{item.data.props.children}</Text>
                                </Pressable> */}
                            </View>
                        }
                        {item.length % 2 !== 0 &&
                        // if the click is not props.children and a number, then nothing? However, I would hate to click small numbers. 
                            <Pressable onPress={() => console.log(item.data)}>
                                <Text style={{converted, backgroundColor: 'yellow' }}>{item.data}</Text>
                            </Pressable>
                            
                        }
                    </View>
                )}
            />
        )

    }

    // console.log(tags)
    // console.log(verses)
    console.log(parsed)
    // return (
    //     // <Text>Not Rendering you</Text>
    //     <FlatList
    //         data={tags}
    //         renderItem={({ item }) => (
    //             <Text>{item}</Text>
    //         )}
    //     />
    // )
    if (data !== null) {
        console.log(data)
    }



    // parse html and create a dom element
    // const TRenderEngine = new TRenderEngine({parseDocument: data.content})

    React.useEffect(() => {
        GetVerse()
    }, [chapter, bible])


    return (
        <View style={{ color: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }}>

            {data !== null &&
                <View>
                    <Text style={{ marginLeft: '25%', marginRight: '25%', color: darkMode ? styles.dark.color : styles.light.color, fontSize: 35 }}>{data.reference}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {/* This version select menu buttons do not like being clicked */}
                        <VersionSelectMenu style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} />
                    </View>
                    <Pressable style={{ height: 30, width: 125, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => navigation.pop(1)}>
                        <Text style={{ borderColor: darkMode ? styles.dark.color : styles.light.color, borderWidth: 1, height: 30, width: 100, color: darkMode ? styles.dark.color : styles.light.color }}>Go Back</Text>
                    </Pressable>
                    <Pressable style={{ height: 30, width: 125, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => navigation.popToTop()}>
                        <Text style={{ borderColor: darkMode ? styles.dark.color : styles.light.color, borderWidth: 1, height: 30, width: 100, color: darkMode ? styles.dark.color : styles.light.color }}>Home Page</Text>
                    </Pressable>
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Change the Font Size:</Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Pressable onPress={() => fontDispatch({ type: "DECREASE_FONT" })}>
                            <AntDesign name='minuscircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, width: 50, height: 50 }} size={30} />
                        </Pressable>
                        <Pressable onPress={() => fontDispatch({ type: "INCREASE_FONT" })}>
                            <AntDesign name='pluscircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, width: 50, height: 50 }} size={30} />
                        </Pressable>
                    </View>

                    {Platform.OS === 'android' &&
                        <View>
                            {data.id === 'GEN.intro' &&
                                <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                        <Text>{data.next.bookId} {data.next.number}</Text>
                                    </Pressable>
                                </View>
                            }
                            {data.id === 'REV.22' &&
                                <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                    {/* data.content is like <p class='p'></p><p class='Gen'></p><p id='GEN.1.1'></p> etc... and scripture styles hits those */}
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <Pressable style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                        <Text>{data.previous.bookId} {data.previous.number}</Text>
                                    </Pressable>
                                    {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View style={{ padding: 10, marginBottom: 100, borderWidth: 4, borderColor: '#333', marginTop: 100 }}>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            {/* <RenderParsed /> */}
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                        <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>

                                        <Pressable style={{ paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>
                                    </View>
                                </View>
                            }
                        </View>
                    }
                    {Platform.OS === 'ios' &&
                        <SafeAreaView>
                            {data.id === 'GEN.intro' &&
                                <View>
                                    <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                        <Text>{data.next.bookId} {data.next.number}</Text>
                                    </Pressable>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                </View>
                            }
                            {data.id === 'REV.22' &&
                                <View>
                                    <Pressable style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                        <Text>{data.previous.bookId} {data.previous.number}</Text>
                                    </Pressable>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View style={{ padding: 10, marginBottom: 100, borderWidth: 4, borderColor: '#333', marginTop: 100 }}>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>

                                        <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>

                                        <Pressable style={{ paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>
                                    </View>
                                </View>
                            }
                        </SafeAreaView>
                    }
                    {Platform.OS === 'web' &&
                        <View>
                            {data.id === 'GEN.intro' &&
                                <View style={{ padding: 10, borderWidth: 1, borderColor: '#333' }}>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <CSSPropertyNameList></CSSPropertyNameList>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                    </View>
                                </View>
                            }
                            {data.id === 'REV.22' &&
                                <View style={{ padding: 10, borderWidth: 1, borderColor: '#333' }}>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderParsed />
                                            {/* <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} /> */}
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                    </View>
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&
                                // ReactDOM.render()
                                <View style={{ padding: 10, borderWidth: 1, borderColor: '#333' }}>

                                    {/* <HTMLView 
                                            value={data.content}
                                            // stylesheet={scriptureStyles}
                                            /> */}
                                    <RenderParsed />
                                    <TRenderEngineProvider parseDocument={data.content}>
                                        <RenderHTMLConfigProvider>

                                            <RenderHTML pressableHightlightColor='yellow' customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>

                                    {/* <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} /> */}
                                    {/* <GenericPressableProps onPress={() => console.log("Works?")}></GenericPressableProps> */}

                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        {/* I am doing next.id to just get the logic down. Then I make it the data-sid or whatever it is in the html */}
                                        <Pressable onPress={() => { dispatch(selectVerse(data.next.id)) }}>
                                            <AntDesign name='group' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                    </View>
                                </View>
                            }
                        </View>
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({

    dark: {
        backgroundColor: '#000000',
        color: '#ffffff',
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000',

    },
    main: {
        flex: 3
    },
    verse: {
        backgroundColor: 'yellow'
    }
})



export default BibleScreen
