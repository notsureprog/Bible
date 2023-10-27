import React from 'react'
import parse, { domToReact } from 'html-react-parser';
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
    const [view, setView] = React.useState(`chapter`)
    const [bible, setBible] = React.useState(route.params.version !== undefined ? route.params.version : 'de4e12af7f28f599-01');
    const [parsed, setParsed] = React.useState(null)
    console.log(bible)
    const [data, setData] = React.useState(null);


    if (data !== null) {
        console.log(data) //array... I will use this for the highlighted verses as reference
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

            const parseOptions = {
                replace: ({ attributes, children }) => {
                    console.log(attributes)
                    console.log(children)
                    if (!attributes) {
                        return
                    }
                    // if (attributes.something === 'whatever')
                    // console.log(children.type)
                    console.log(domToReact(children, parseOptions))
                    // i will have to get my styles up here... I cannot do it anywhere else but here
                    if (typeof (children.name) !== "undefined") {
                        console.log(<children.name>{domToReact(children, parseOptions)}</children.name>)
                        return (
                            <children.name>{domToReact(children, parseOptions)}</children.name>
                        )
                    }

                    //for (var i = 0; i < children.length; i++) {
                    //    console.log(Object.values(children[i].attribs)[0])
                    //     console.log(children[i])
                    //     console.log(attributes[i])
                    //     if (attributes.value !== undefined) {
                    //         console.log("Can I get hit")
                    //         // console.log(<children.name class={attributes.value} style={{ color: converted[`.eb-container ${attributes.value}`].color, fontSize: converted[`.eb-container ${attributes.value}`].fontSize }}>{children[i].data}</children.name>)
                    //         // i honestly could do this, but dynamic would be so much prettier
                    //         // this is still html, so it would be class not className
                    //         // class^v for verse number probably...
                    // idk what i was thinking lol. i guess children.name is, for example, span, div, p, etc...
                    //         return <children.name class={attributes.value} style={{  fontSize: converted[`.eb-container ${attributes.value}`].fontSize }}>{children[i].data}</children.name>

                    //     }
                    //}

                }
            }
            const result = await axios(options);
            // console.log(parse(JSON.stringify(result.data.data)))
            setParsed(parse(JSON.stringify(result.data.data), parseOptions))

            console.log(result.data.data); //not an array
            setData(result.data.data);
            // parse(result.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    // may not have to do all of this...
    // I really almost have it here, but that stupid attribute of, for example, 9:1: '' gives me an error, and i think it is preventing me from rendering on ios and android (since it is saying the same thing on my physical device and in the web)
    const RenderParsed = () => {

        let tags = []
        let verses = []
        let allData = []
        if (parsed !== null && data !== null) {
            console.log(data.id.split('.'))
            console.log(parsed)

            if (data.id.split('.')[1] !== 'intro') {
                for (var i = 0; i < parsed.length; i++) {
                    if (i !== 0 && i !== parsed.length - 1) {
                        parsed[i].props.children.map((result) => {
                            verses.push({ data: result, chapter: data.id })
                        })
                    }
                }
            }
            console.log(verses)
        }
        return (

            <FlatList
                data={verses}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    // console.log(index % 2)

                    <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, color: darkMode ? styles.dark.color : styles.light.color }}>

                        {index % 2 !== 0 &&
                            <View >
                                <Pressable onPress={() => dispatch(selectVerse(`${data.id}.${item.data}`))}>
                                    <Text style={{ color: converted['.eb-container .wj'].color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>{item.data}</Text>
                                </Pressable>
                            </View>
                        }
                        {index % 2 === 0 &&
                            <View>

                            </View>
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

                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <Pressable style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                        <Text>{data.previous.bookId} {data.previous.number}</Text>
                                    </Pressable>

                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View style={{ padding: 10, marginBottom: 100, borderWidth: 4, borderColor: '#333', marginTop: 100 }}>

                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `${RenderParsed}` }} />
                                    {/* <RenderParsed /> */}
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
                                    {/* <TRenderEngineProvider parseDocument={data.content}>
                                        <RenderHTMLConfigProvider>

                                            <RenderHTML pressableHightlightColor='yellow' customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider> */}

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

    }
})



export default BibleScreen
