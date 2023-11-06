import React from 'react'
import parse, { domToReact } from 'html-react-parser';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Platform, FlatList } from 'react-native'
import axios from 'axios'
import _ from 'underscore'
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
import { pushVersesToDatabase } from '../features/auth/authSlice';
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

const BibleScreen = ({ navigation, route }) => {
    const user = useSelector((state) => state.authenticate.reducer) //change name to userReducer
    const dispatch = useDispatch()

    console.log(user.highlightedVerses)


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
    const [fontState, fontDispatch] = React.useReducer(fontReducer, { size: 24 })
    const [chapter, setChapter] = React.useState(route.params.chapter !== undefined ? route.params.chapter : 'GEN.1');
    const [bible, setBible] = React.useState(route.params.version !== undefined ? route.params.version : 'de4e12af7f28f599-01');
    const [parsed, setParsed] = React.useState(null)
    const [data, setData] = React.useState(null);

    console.log(parsed)

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
    const allowedStyles = {
        fontWeight: 'bold'
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
                    "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
                    "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
                    "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
                    "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
                    "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
                    "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
                    "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
                ], //children[i].parent.name but no repeats... Idk, I may just need to white list certain ones in the api
                allowedAttributes: {
                    'p': ['*'], //wont leave these as * btw...
                    'span': ['*'],
                    // 'div':['*']
                }
            }
            // Doesnt even work yet
            const parseOptions = {
                replace: ({ attributes, children }) => {

                    console.log(attributes)
                    console.log(typeof attributes)
                    console.log(children)
                    console.log(typeof children)

                    if (!attributes) {
                        return
                    }

                    if (!children) {
                        return
                    }

                    if (attributes.class === 'wj') {
                        console.log("words of jesus")
                    }
                }
            }
            const result = await axios(options);
            const cleanHTML = sanitizeHTML(result.data.data.content, sanitizeOptions)
            console.log(result.data.data.content)
            setParsed(cleanHTML, parseOptions)
            setData(result.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    // I think everything but psalm is taken care of in this program. I am trying to test and code at the same time.

    const RenderParsed = () => {
        let verses = []
        const parsedHTML = parse(parsed)
        console.log(parsedHTML.length)
        console.log(parsedHTML)
        // I am kind of thinking about or-ing this with parsedHTML[i].props.children === 'string'
        // if (parsedHTML.length === undefined) {
        if (parsedHTML === 'object') {
            console.log(typeof parsedHTML) //this is getting ugly...
            parsedHTML.props.children.map((result) => {
                console.log(result)
                if (typeof result === 'string') {
                    console.log("Grouped verses to click and store in the db")
                    verses.push({ text: result, tag: 'p', className: 'v' })
                }
                if (typeof result === 'object') {
                    const testIfNum = +result.props.children
                    const className = result.props.className
                    const DynamicHTML = result.type
                    console.log(typeof result.props.children)
                    console.log(result.props.children)
                    if (isNaN(testIfNum)) {
                        // it isnt really a different array really... 
                        // all i want is to combine all of the texts, but not the className or tags. 
                        // I only want to merge the text for storing in db and highlight, but not for styling...
                        verses.push({ text: result.props.children, verse: null, tag: DynamicHTML, className: className })
                    }
                    if (!isNaN(testIfNum)) {
                        // nested hooks not allowed
                        verses.push({ verse: result.props.children, text: null, className: className, tag: DynamicHTML })
                    }
                    // verses.push({ text: result.props.children, className: result.props.className, tag: result.type })
                }
            })
        }
        // i needs to be 1 for psa
        for (var i = 0; i < parsedHTML.length; i++) {
            console.log(typeof parsedHTML[i])
            // it is getting kind of ugly on my side... 
            // if the next piece is a number
            // this is not valid in psalm
            console.log(typeof parsedHTML[i].props.children)
            console.log(parsedHTML[i].props.children)
            if (typeof parsedHTML[i].props.children === 'string') {
                verses.push({ text: parsedHTML[i].props.children, verse: null, className: parsedHTML[i].props.className, tag: parsedHTML[i].type })
            }
            if (typeof parsedHTML[i].props.children === 'object' && chapter.split('.')[0] === 'PSA') {
                console.log(parsedHTML[i].props.children)
            }

            parsedHTML[i].props.children.map((result, index) => {
                console.log(_.range(index, index + 1))

                // 
                console.log(result)
                console.log(index)
                console.log(typeof result)
                if (typeof result === 'object') {
                    const testIfNum = +result.props.children
                    const className = result.props.className
                    const DynamicHTML = result.type

                    if (isNaN(testIfNum)) {
                        // so maybe length too... although one of the psalms (119) goes into 100 verses.
                        // I have read the entire bible a few times. As far as i know, there are only a few instances of the bible using numbers rather than spelling the number out. onee of those is the number of the beast in newer versions being 666 rather than six hundred threescore and six.
                        // it isnt really a different array really... 
                        verses.push({ text: result.props.children, verse: null, tag: DynamicHTML, className: className })
                    }
                    if (!isNaN(testIfNum)) {
                        // nested hooks not allowed
                        verses.push({ verse: result.props.children, text: null, className: className, tag: DynamicHTML })
                    }

                }
                if (typeof result !== 'object') {
                    // needs to be the previous tag and className
                    verses.push({ text: result, tag: 'p', className: '' })
                }
            })
        }
        // verses.push({ text: parsedHTML[i].props.children, verse: null, className: parsedHTML[i].props.className, tag: parsedHTML[i].type })

        console.log(verses)

        return (
            // i may have to map this instead of flatlist so i can do some other things. i likee the lazy loading though for performance.
            <FlatList
                data={verses}
                renderItem={({ item, index }) => (
                    // console.log(typeof item.text)
                    <View>
                        {/* group all of item.text */}
                        {/* I cannot group the array anyways because the different className and tags, so I cannot get 1: [{text: ['in the beginning', 'God', 'created']}] because I would have className 'add, wj, etc...'...*/}
                        <View>
                            {item.verse !== null &&
                                // https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
                                // I am getting ahead of myself. Do the above after I combine all of the stuff in between verses into one verse.
                                <Text>{item.verse}</Text>
                            }
                            {/* well the ref.previous.verse or whatever */}
                            <Pressable onPress={() => dispatch(pushVersesToDatabase({ verse: item.verse, username: user.username, book: `${data.bookId}`, chapter: `${data.number}`, version: bible }))}>
                                {/* I need to combine item.text either here, or in the RenderParsed Fn */}
                                <item.tag style={converted[`.eb-container .${item.className}`]} className={item.className}>{item.text}</item.tag>
                            </Pressable>
                        </View>
                    </View>
                )}
            />
        )

    }
    if (data !== null) {
        console.log(data)
    }
    console.log(parsed)
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
                        <VersionSelectMenu style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} />
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
                                        <RenderParsed />
                                        <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        <Pressable onPress={() => { console.log("Hello") }}>
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