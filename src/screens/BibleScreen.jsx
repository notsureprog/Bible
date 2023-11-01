import React from 'react'
import parse, { domToReact } from 'html-react-parser';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Platform, FlatList } from 'react-native'
import axios from 'axios'
import sanitizeHTML from 'sanitize-html'
import { WebView } from 'react-native-webview'
import { HTMLElementModel, CSSPropertyNameList, CSSProcessorConfig, TRenderEngineProvider, RenderHTML, HTMLContentModel, RenderHTMLConfigProvider } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { EXPO_PUBLIC_API_URL, BIBLE_API_KEY, REACT_APP_EXPRESS_URL } from '@env'
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
                url: `https://885f8317-2398-4449-80ed-33ca172f5f8b.mock.pstmn.io/BibleVerses`,
                // url: `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}`,
                // headers: {
                //     'api-key': `${BIBLE_API_KEY}`
                // }
            }

            const sanitizeOptions = {
                allowedTags: ['p', 'span', 'div'], //children[i].parent.name but no repeats... Idk, I may just need to white list certain ones in the api
                allowedAttributes: {
                    'p': ['*'],
                    'span': ['*'],
                    'div': ['*']
                }
            }




            // setData(parse(sanitizeHTML(result.data.data.content, sanitizeOptions), parseOptions))


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

                    // // for (var i = 0; i < attributes.length; i++) {
                    // // console.log(attributes[i].value)

                    // for (var i = 0; i < attributes.length; i++) {
                    //     if (children[i].next === 'undefined') {
                    //         return
                    //     }
                    //     // let group = []
                    //     //group for clicking a singlee verse with all of the styles. if next !== null and data-number is present then group on the previous data-number up to the current
                    //     if (attributes[i].value && children[i].next !== 'null' && children[i].next !== 'undefined') { // === text/Element 

                    //         const DynamicHTML = children[i].parent.name
                    //         const wholeVerse = []
                    //         console.log(DynamicHTML)
                    //         const styleattribute = attributes[i].value.split('\\"')[1]
                    //         console.log(styleattribute)
                    //         // if next !== null && next !== undefined, then merge all of the stuff
                    //         if (attributes[i].prev === 'null') {
                    //             console.log(attributes[i]['attribs']['data-number'])
                    //         }
                    //         console.log(<DynamicHTML style={converted[`.eb-container .${styleattribute}`]}>{domToReact(children, parseOptions)}</DynamicHTML>)
                    //         return <DynamicHTML style={converted[`.eb-container .${styleattribute}`]}>{domToReact(children, parseOptions)}</DynamicHTML>
                    //     }

                    // }

                    // if (attributes[i].value) { // === text/Element 
                    //     // i think this is good for the span, p, div, etc...
                    //     const DynamicHTML = children[i].parent.name

                    //     console.log(DynamicHTML)
                    //     const styleattribute = children[i].parent.attribs.class.split('\\"')[1]
                    //     console.log(styleattribute)
                    //     const property = attributes[i].something
                    //     // i know this problem i think...
                    //     // 'property': converted[`.eb-container .'styleattribute'`].property -- although there is no [.eb-container .'styleattribute'].color and words of christ are red...
                    //     return <DynamicHTML className={converted[`.eb-container .${styleattribute}`]}>{domToReact(children, parseOptions)}</DynamicHTML>
                    // }

                }
                // if (typeof (children.name) !== "undefined") {
                //     console.log(<span>{domToReact(children, parseOptions)}</span>)
                //     return (
                //         <p>{domToReact(children, parseOptions)}</p>
                //     )
                // }

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

    const RenderParsed = () => {
        let verses = []
        // console.log(parse(parsed)) // i will probably setData here
        const parsedHTML = parse(parsed)
        console.log(parsedHTML)
        for (var i = 0; i < parsedHTML.length; i++) {
            console.log(typeof parsedHTML[i])

            // console.log(DynamicHTML)
            parsedHTML[i].props.children.map((result) => {
                if (typeof result === 'object') {

                    const DynamicHTML = result.type
                    const className = result.props.className
                    console.log(className)
                    console.log(DynamicHTML)
                    console.log(result.props.children)
                    verses.push({text: result.props.children, tag: DynamicHTML, className: className})
                    console.log(<DynamicHTML>{result.props.children}</DynamicHTML>)
                    
                    return <DynamicHTML className={className} style={converted['.eb-container *']} key={result.props['data-sid']}>{result.props.children}</DynamicHTML>
                }
            })
            // if (typeof parsed[i].props.children === 'object') {

            // }


        }
        // there should not be too many class names in here, but idl
        // let tags = []
        // let verses = []
        // if (parsed !== null && data !== null) {

        //     if (data.id.split('.')[1] !== 'intro') {
        //         for (var i = 0; i < parsed.length; i++) {
        //             if (i !== 0 && i !== parsed.length - 1) {
        //                 console.log(parsed)
        //                 parsed[i].props.children.map((result) => {
        //                     verses.push({ data: result, chapter: data.id, tag: parsed[i].type, class: result.className })
        //                 })
        //             }
        //         }
        //     } else {
        //         verses.push({ data: `The Book of ${data.id}` })
        //     }
        //     console.log(verses)
        // }
        return (
            <FlatList 
            data={verses}
            renderItem={({item}) => (
                <View>
                    <item.tag style={converted[`.eb-container .wj`]} className={item.className}>{item.text}</item.tag>
                </View>
            )}
            />
        )
        // return (
        //     <FlatList
        //         data={verses}
        //         keyExtractor={(item, index) => index.toString()}
        //         renderItem={({ item, index }) => (
        //             <View>
        //                 {/* Still would need the verse number because some verses are the same: ex: Mark 9:44, 9:46, 9:48. Probably should store the version too because, for example, KJV has more than NIV */}
        //                 <Pressable onPress={() => dispatch(pushVersesToDatabase({ username: user.username, verse: `${item.data}` }))}>
        //                     <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, color: darkMode ? styles.dark.color : styles.light.color }}>
        //                         {typeof item.data !== 'object' &&
        //                             <View>
        //                                 {/* <Pressable onPress={() => dispatch(pushVersesToDatabase({ username: user.username, verse: `${item.data}` }))}> */}
        //                                 <Text>{item.data}</Text>
        //                                 {/* </Pressable> */}
        //                             </View>
        //                         }
        //                         {typeof item.data === 'object' &&
        //                             <View>
        //                                 {/* <Pressable onPress={() => dispatch(pushVersesToDatabase({ username: user.username, verse: `${item.data}` }))}> */}
        //                                 <Text
        //                                     style={item.data.props.style}
        //                                     className={item.data.props.className}>{item.data.props.children}
        //                                 </Text>
        //                                 {/* </Pressable> */}
        //                             </View>
        //                         }
        //                     </View >
        //                 </Pressable>
        //             </View>
        //         )}
        //     />
        // )
    }
    console.log(parsed)

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

                                <View>
                                    {/* <WebView
                                            source={{ html: data.content }}
                                        /> */}

                                    <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                        <RenderHTML source={{ html: `${data.content}` }} />
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
