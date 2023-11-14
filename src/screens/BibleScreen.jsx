import React from 'react'
import parse, { domToReact } from 'html-react-parser';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Platform, FlatList } from 'react-native'
import axios from 'axios'
import _ from 'underscore'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from './ErrorPage';
import sanitizeHTML from 'sanitize-html'
import { WebView } from 'react-native-webview'
import { HTMLElementModel, CSSPropertyNameList, CSSProcessorConfig, TRenderEngineProvider, RenderHTML, HTMLContentModel, RenderHTMLConfigProvider } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { EXPO_PUBLIC_API_URL, BIBLE_API_KEY, REACT_APP_EXPRESS_URL, REACT_APP_MOCK_CHAPTER_CONTENTS } from '@env'
import VersionSelectMenu from '../../VersionSelectMenu'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { selectVerse } from '../features/verse/bookSlice'
import { pushVersesToDatabase, putVerseInDatabase } from '../features/auth/authSlice';
import { converted } from '../../css/scriptureConverted'
import { useDispatch, useSelector } from 'react-redux'

// https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/chapters/PSA.1/verses

// https://www.w3schools.com/react/react_jsx.asp
/*
JSX stands for JavaScript XML.

JSX allows us to write HTML in React.

JSX makes it easier to write and add HTML in React.

*/
// https://github.com/meliorence/react-native-render-html/blob/v6.3.1/packages/render-html/src/TNodeRenderer.tsx

// Example of what I am Thinking - <${css}><${html}></${css}>
/**
 * 
 { label: 'KJV', value: 'de4e12af7f28f599-01' },
        { label: 'ASV', value: '06125adad2d5898a-01' },
        { label: 'WEB', value: '9879dbb7cfe39e4d-03' },
        { label: 'WEBBE', value: '7142879509583d59-04' },
 */

const BibleScreen = ({ navigation, route }) => {
    const user = useSelector((state) => state.authenticate.reducer) //change name to userReducer
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

    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode;
    const [fontState, fontDispatch] = React.useReducer(fontReducer, { size: 24 });
    const [highlighted, setHighlighted] = React.useState(false);
    const [chapter, setChapter] = React.useState(route.params.chapter); //took off deep linking for now, so user cannot crash in the url...
    const [bible, setBible] = React.useState(route.params.version);
    const [html, setHtml] = React.useState(null);
    const [data, setData] = React.useState(null);

    const customHTMLElementModels = {
        'dynamic-font': HTMLElementModel.fromCustomModel({
            tagName: 'dynamic-font',
            element: RenderHTML,

            mixedUAStyles: {
                color: darkMode ? styles.dark.color : styles.light.color,
                fontSize: fontState.size,
            },

            contentModel: HTMLContentModel.mixed
        })
    }

    const GetVerse = async () => {
        try {
            const options = {
                method: 'GET',
                url: `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}`,
                headers: {
                    'api-key': `${BIBLE_API_KEY}`
                }
            }

            const sanitizeOptions = {
                allowedTags: [
                    // Will be removing all but 3.
                    "p", "span"
                ], //children[i].parent.name but no repeats... Idk, I may just need to white list certain ones in the api
                allowedAttributes: {
                    'p': ['*'], //wont leave these as * btw...
                    'span': ['*'],
                    // 'div':['*']
                }
            }

            const result = await axios(options);
            const cleanHTML = sanitizeHTML(result.data.data.content, sanitizeOptions);
            console.log(result.data.data.content);
            setHtml(cleanHTML);
            // setHtml(cleanHTML, parseOptions)
            setData(result.data.data);
        } catch (err) {
            console.log(err);
        }
    }

    const RenderParsed = () => {

        const parsedHTML = parse(html); //returns jsx elements, empty array, or string
        console.log(typeof parsedHTML);
        console.log(parsedHTML);
        // highlight all text after verse number.
        const verses = [];
        let groupedVerse = [];

        // console.log(verses)
        if (Array.isArray(parsedHTML)) {
            console.log("The Array")
            console.log(parsedHTML)
            parsedHTML.map((result) => {
                if (Array.isArray(result.props.children)) {
                    result.props.children.map((data) => {
                        if (typeof data === 'object') {
                            if (!isNaN(Number(data.props.children))) {
                                console.log(data.props.children)
                                groupedVerse.push(data.props.children)
                                verses.push({ verse: data.props.children, text: null, className: data.props.className, tag: data.type })
                            }
                            if (isNaN(Number(data.props.children))) {
                                verses.push({ verse: null, text: data.props.children, className: data.props.className, tag: data.type })

                            }
                            // I think this is good too...
                            if (typeof result === 'string') {
                                verses.push({ verse: null, text: result, className: result.props.className, tag: result.type })
                            }
                        }
                        if (typeof data === 'string') {
                            verses.push({ text: data, verse: null, className: result.props.className, tag: result.type })
                        }
                    })
                }
            })
        }



        // console.log(user.highlightedVerses.find(element => element.verse === '1' && element.book === 'GEN.33')) //this will come from mongodb and store... Go ahead and push i guess for fallback...
        // const testToSeeIfVerseInDB = user.highlightedVerses.find(element => element.verse === item.verse && element.book === item.book)
        if (Array.isArray(parsedHTML) === false && typeof parsedHTML === 'object') {
            console.log("The object")
            console.log(parsedHTML)
            if (Array.isArray(parsedHTML.props.children)) {
                parsedHTML.props.children.map((result) => {
                    // here is where we need to be manipulating some of this data. 
                    // I could either say that the verse is not null in all of the data, and make sure the verses correspond to the text
                    // Or i could have a verse, and have an array of text to map out.
                    if (typeof result === 'object') {
                        if (!isNaN(Number(result.props.children))) {
                            console.log(result.props.children)
                            verses.push({ verse: result.props.children, text: null, className: result.props.className, tag: result.type })
                        }
                        if (isNaN(Number(result.props.children))) {
                            console.log(result.props.children)
                            verses.push({ verse: null, text: result.props.children, className: result.props.className, tag: result.type })
                        }
                    }
                    if (typeof result === 'string') {
                        verses.push({ verse: null, text: result, className: parsedHTML.props.className, tag: parsedHTML.type })
                    }
                })
            }
        }
        // for (var i = 1; i < groupedVerse.length; i++) {
        //     verses.map((result) => {
        //         if(result.verse === null) {
        //             result.verse = i
        //         }
        //     })
        // }
        for (var i = 0; i < verses.length; i++) {
            let v;
            verses.map((result) => {
                if (result.verse !== null) {
                    v = result.verse
                }
                if (result.verse === null) {
                    result.verse = v
                }
            })
        }

        console.log(verses)

        return (

            <View>
                <FlatList
                    // verses
                    // data={Array.isArray(parsedHTML) ? parsedHTML : [parsedHTML]}
                    data={verses}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        // const testToSeeIfVerseInDB = user.highlightedVerses.find(element => element.verse === '1' && element.book === 'EPH.6' && element.chapter === 'EPH.6')
                        /**
                         * 
                         * Ex: 
                         * {verse: '1', book: 'REV', chapter: '1', version: 'KJV'}
                         * {verse: '5', book: 'REV', chapter: '1', version: 'KJV'} //christ is the prince of the kings of the earth
                         * {verse: '6', book: 'REV', chapter: '1', version: 'KJV'} //christ made us kings and priests
                         */
                        const testToSeeIfVerseInDB = user.highlightedVerses.find(element => element.verse === item.verse && element.book === data.id.split('.')[0] && element.chapter === chapter.split('.')[1])
                        console.log(testToSeeIfVerseInDB)
                        return (
                            <View style={{ margin: 0, padding: 0, display: 'flex' }}>
                                {/* i guess another boolean for highlighted is user.highlighted.something.find === undefined/null */}
                                <Pressable style={{
                                    color: darkMode ? styles.dark.color : styles.light.color,
                                    backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor
                                }}
                                    onPress={() => {
                                        dispatch(pushVersesToDatabase({ verse: item.verse, username: user.username, book: data.id.split('.')[0], chapter: chapter.split('.')[1], version: bible }));
                                        // if nothing matches theen it is undefined...
                                        setHighlighted(typeof testToSeeIfVerseInDB === 'undefined' ? highlighted : !highlighted)
                                    }}
                                >
                                    {item.text === null &&
                                        <View>
                                            <item.tag style={converted[`.eb-container .${item.className}`]}>{item.verse}</item.tag>
                                        </View>
                                    }
                                    {item.text !== null &&
                                        <View style={{backgroundColor : typeof testToSeeIfVerseInDB !== 'undefined' ? 'yellow' : darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor}}>
                                            {/* i want all text with identical verses to be highlighted */}
                                            <item.tag style={converted[`.eb-container .${item.className}`]}>{item.text}</item.tag>
                                        </View>
                                    }
                                </Pressable>
                            </View>
                        )
                    }}
                />
            </View>
        )
    }

    if (data !== null) {
        console.log(data)
    }
    console.log(html)
    console.log(bible)

    React.useEffect(() => {
        GetVerse()
    }, [chapter, bible])


    return (
        <View style={{ color: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }}>

            {data !== null &&
                <View>
                    <Text style={{ marginLeft: '25%', marginRight: '25%', color: darkMode ? styles.dark.color : styles.light.color, fontSize: 35 }}>{data.reference}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    </View>
                    <Pressable style={{ height: 30, width: 150, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => navigation.pop(1)}>
                        <Text style={{ borderColor: darkMode ? styles.dark.color : styles.light.color, borderWidth: 1, height: 30, width: 100, color: darkMode ? styles.dark.color : styles.light.color }}>Go Back</Text>
                    </Pressable>
                    <Pressable style={{ height: 30, width: 150, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => navigation.popToTop()}>
                        <Text style={{ borderColor: darkMode ? styles.dark.color : styles.light.color, borderWidth: 1, height: 30, width: 100, color: darkMode ? styles.dark.color : styles.light.color }}>Home Page</Text>
                    </Pressable>
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, width: 150 }}>Change the Font Size:</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', width: 150 }}>
                        <Pressable onPress={() => fontDispatch({ type: "DECREASE_FONT" })}>
                            <AntDesign name='minuscircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, width: 50, height: 50 }} size={30} />
                        </Pressable>
                        <Pressable onPress={() => fontDispatch({ type: "INCREASE_FONT" })}>
                            <AntDesign name='pluscircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, width: 50, height: 50 }} size={30} />
                        </Pressable>
                        <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                        </Pressable>

                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
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

                                <View>
                                    {/* <WebView
                                            source={{ html: data.content }}
                                        /> */}

                                    <ScrollView style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                        {/* for now... */}
                                        <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                        <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>

                                        <Pressable style={{ paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>
                                    </ScrollView>
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
                                            <RenderHTML source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
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
                                            <RenderHTML source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                        </RenderHTMLConfigProvider>
                                    </TRenderEngineProvider>
                                    <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>

                                        {/* <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>

                                        <Pressable style={{ paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable> */}
                                    </View>
                                </View>
                            }
                        </SafeAreaView>
                    }
                    {Platform.OS === 'web' &&
                        <View>
                            {data.id === 'GEN.intro' &&
                                <View>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <CSSPropertyNameList></CSSPropertyNameList>
                                            {/* <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} /> */}
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
                                <View>
                                    <TRenderEngineProvider>
                                        <RenderHTMLConfigProvider>
                                            <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
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
                                <View>
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <ErrorBoundary
                                            FallbackComponent={ErrorPage}>
                                            <RenderParsed />
                                        </ErrorBoundary>
                                        {/* I can change fint in the convertedCss file somehow... */}
                                        {/* <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        <Pressable onPress={() => { console.log("Hello") }}>
                                            <AntDesign name='group' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable> */}
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