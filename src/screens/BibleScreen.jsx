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
    const [highlighted, setHighlighted] = React.useState(false)
    const [chapter, setChapter] = React.useState(route.params.chapter !== undefined ? route.params.chapter : 'GEN.1');
    const [bible, setBible] = React.useState(route.params.version !== undefined ? route.params.version : 'de4e12af7f28f599-01');
    const [html, setHtml] = React.useState(null)
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
            // Doesnt even work yet
            // const parseOptions = {
            //     replace: ({ attributes, children }) => {

            //         console.log(attributes)
            //         console.log(typeof attributes)
            //         console.log(children)
            //         console.log(typeof children)

            //         if (!attributes) {
            //             return
            //         }

            //         if (!children) {
            //             return
            //         }

            //         if (attributes.class === 'wj') {
            //             console.log("words of jesus")
            //         }
            //     }
            // }
            const result = await axios(options);
            const cleanHTML = sanitizeHTML(result.data.data.content, sanitizeOptions)
            console.log(result.data.data.content)
            setHtml(cleanHTML)
            // setHtml(cleanHTML, parseOptions)
            setData(result.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    const RenderParsed = () => {

        const parsedHTML = parse(html) //returns jsx elements, empty array, or string
        console.log(typeof parsedHTML)
        console.log(parsedHTML)
        // highlight all text after verse number.
        const verses = [] // I was thinking push everything iin here, and test to see if a num on each split(',') and combine if not
        // console.log(verses)
        if (Array.isArray(parsedHTML)) {
            console.log("The Array")
            console.log(parsedHTML)
            parsedHTML.map((result) => {
                if (Array.isArray(result.props.children)) {
                    result.props.children.map((data) => {
                        if (typeof data === 'object') {
                            if (!isNaN(Number(data.props.children))) {
                                verses.push({ verse: data.props.children, text: null, className: data.props.className, tag: data.type })
                            }
                            if (isNaN(Number(data.props.children))) {
                                verses.push({ verse: null, text: data.props.children, className: data.props.className, tag: data.type })
                            }
                            // I think this is good too...
                            if (typeof result === 'string') {
                                verses.push({ verse: null, text: result, className: result.props.className, tag: result.type })
                            }
                            // if (typeof parsedHTML.props.children === 'string') {
                            //     verses.push({ text: parsedHTML.props.children, verse: null, className: '', tag: 'p' })
                            // }
                        }
                        if (typeof data === 'string') {
                            verses.push({ text: data, verse: null, className: result.props.className, tag: result.type })
                        }
                    })
                }
            })
        }
        if (Array.isArray(parsedHTML) === false && typeof parsedHTML === 'object') {
            console.log("The object")
            console.log(parsedHTML)
            if (Array.isArray(parsedHTML.props.children)) {
                parsedHTML.props.children.map((result) => {
                    if (typeof result === 'object') {
                        if (!isNaN(Number(result.props.children))) {
                            verses.push({ verse: result.props.children, text: null, className: result.props.className, tag: result.type })
                        }
                        if (isNaN(Number(result.props.children))) {
                            verses.push({ verse: null, text: result.props.children, className: result.props.className, tag: result.type })
                        }
                    }
                    if (typeof result === 'string') {
                        verses.push({ verse: null, text: result, className: parsedHTML.props.className, tag: parsedHTML.tag })
                    }
                })
            }

        }
        console.log(verses)
        // if (parsedHTML.length === undefined) {
        //     if (chapter.split('.')[1] === 'intro') {
        //         verses.push({text: parsedHTML.props.children, verse: null, className: parsedHTML.props.className, tag: 'p'})
        //     }

        //     parsedHTML.props.children.map((result) => {
        //         if (typeof result === 'string') {
        //             verses.push({ text: result, tag: 'p', className: 'v' })
        //         }
        //         if (typeof result === 'object') {
        //             const testIfNum = +result.props.children
        //             const className = result.props.className
        //             const DynamicHTML = result.type
        //             if (isNaN(testIfNum)) {
        //                 verses.push({ text: result.props.children, verse: null, tag: DynamicHTML, className: className })
        //             }
        //             if (!isNaN(testIfNum)) {
        //                 verses.push({ verse: result.props.children, text: null, className: className, tag: DynamicHTML })
        //             }
        //         }
        //     })
        // }
        // // JSX elements
        // for (var i = 0; i < parsedHTML.length; i++) {
        //     if (chapter.split('.')[0] === 'PSA') {
        //         // notsure psalm 13 and psalm 150 work, but others do not. I will come back to the ui on web later. I am working on the db and thunk handling some... plus getting rid of all but main branch. 
        //         <FlatList
        //             data={parsedHTML}
        //             renderItem={({ item }) => (
        //                 <Text>{item.props.children}</Text>
        //             )}
        //         />

        //     }
        //     if (chapter.split('.')[1] === 'intro') {
        //         <Text>{chapter}</Text>
        //     }
        //     if (typeof parsedHTML[i].props.children === 'string') {
        //         verses.push({ text: parsedHTML[i].props.children, verse: null, tag: parsedHTML[i].type, className: parsedHTML[i].props.className })
        //     }
        //     if (parsedHTML[i].props.children === null) {
        //         return
        //         // verses.push({text: null, verse: null, className: null, tag: 'p'})
        //     }
        //     if (typeof parsedHTML[i].props.children === 'object') {

        //         parsedHTML[i].props.children.map((result, index) => {
        //             if (typeof result === 'object') {
        //                 const testIfNum = +result.props.children
        //                 const className = result.props.className
        //                 const DynamicHTML = result.type

        //                 if (isNaN(testIfNum)) {
        //                     verses.push({ text: result.props.children, verse: null, tag: DynamicHTML, className: className })
        //                 }
        //                 if (!isNaN(testIfNum)) {
        //                     verses.push({ verse: result.props.children, text: null, className: className, tag: DynamicHTML })
        //                 }
        //             }
        //             if (typeof result !== 'object') {
        //                 verses.push({ text: result, tag: 'p', className: '' })
        //             }
        //         })
        //     }
        // }


        return (
            // <Text>Hello Bible</Text>
            // {Array.isArray(parsedHTML) === false && (
            //     <FlatList 
            //     data={[parsedHTML]}
            //     keyExtractor={(item, index) => index.toString()}
            //     renderItem={()}
            //     />

            // }
            <View>
                {/* 
                // potential solutions:
                // RESEARCH THIS SOME BECAUSE FLATLIST MAY BE A BIT DIFFERENT
                // I could have the user click the number and put it in the db (easier, but not as user friendly)
                // I could group all of the items in between the numbers and store the number iin db and highlight the group. 
                // tbh, I would need the group anyways...
                // I THINK ALL DATA IS ITEM.PROPS.CHILDREN up until the additional .props.children
                */}
                <FlatList
                    // verses
                    data={Array.isArray(parsedHTML) ? parsedHTML : [parsedHTML]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {

                        return (

                            <View>
                                {/* I need to be able to group results into one verse. if !isNan(result) */}
                                {/* then apply a background color. and it will be user.highlightedVerses frmo the store. */}
                                {/* the number will be in here. Everything else can be merged together */}
                                {typeof item.props.children === 'string' &&
                                    // console.log(+item.props.children)
                                    <Pressable>
                                        {/* {verses.push(item.props.children)} */}
                                        <item.type style={converted[`.eb-container .${item.props.className}`]}>{item.props.children}</item.type>
                                    </Pressable>

                                }
                                {item.props.children === null &&
                                    <Pressable >

                                        <item.type style={converted[`.eb-container .${item.props.className}`]}></item.type>
                                    </Pressable>
                                }
                                {/* {item.props.children.props.children !== null &&
                                <Text>{item.props.children.props.children}</Text>
                            } */}
                                {/* {typeof item.props.children === 'object' && item.props.children && */}

                                {Array.isArray(item.props.children) === false && item.props.children !== null &&
                                    <View>
                                        {typeof item.props.children === 'string' &&
                                            <View>
                                                {/* {verses.push(item.props.children)} */}
                                                <item.type style={converted[`.eb-container .${item.props.className}`]}>{item.props.children}</item.type>
                                            </View>
                                        }
                                        {typeof item.props.children === 'object' &&
                                            <View>
                                                {/* {verses.push(item.props.children.props.children)} */}
                                                <item.type style={converted[`.eb-container .${item.props.className}`]}>{item.props.children.props.children}</item.type>
                                            </View>
                                        }
                                    </View>

                                    // <item.type>{item.props.children.props.children}</item.type>
                                }
                                {Array.isArray(item.props.children) &&
                                    <View>
                                        {item.props.children.map((result) => (
                                            // console.log(result)
                                            <View key={result.key}>
                                                {typeof result === 'string' &&
                                                    <View>
                                                        {/* however, there are conditions for things like p that need to be taken care of */}
                                                        {/* await putVerseInDatabase(verse, username, book, chapter, version, (err, data) => { */}
                                                        {/* {verses.push(result)} */}

                                                        <Pressable style={{ backgroundColor: highlighted ? 'yellow' : darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} onPress={() => { dispatch(pushVersesToDatabase({ verse: result, username: user.username, book: data.id, chapter: chapter, version: bible })); setHighlighted(!highlighted) }}>
                                                            <item.type style={converted[`.eb-container .${item.type}`]}>
                                                                {result}
                                                            </item.type>
                                                        </Pressable>



                                                    </View>
                                                }
                                                {typeof result === 'object' &&
                                                    <View>
                                                        {/* {verses.push(result.props.children)} */}
                                                        <result.type style={converted[`.eb-container .${result.props.className}`]}>{result.props.children}</result.type>
                                                    </View>
                                                }
                                            </View>
                                        ))}
                                    </View>
                                }


                                {/* } */}
                                {/* I know the error is thrown from the item.props.children.props.children */}
                                {/* I found a null one too */}
                                {/* Just have to get it as it comes. Added errorboundary to parsed component in Platform === 'web' */}
                                {/* {item.props.children === null &&
                                <Text>Blank space</Text>
                            } */}

                            </View>
                        )
                        // console.log(verses)
                    }

                    }
                />
            </View>
            // <FlatList
            //     data={verses}
            //     renderItem={({ item, index }) => (
            //         <View>
            //             <View>
            //                 {item.verse !== null &&
            //                     <Text>{item.verse}</Text>
            //                 }
            //                 <Pressable onPress={() => dispatch(pushVersesToDatabase({ verse: item.verse, username: user.username, book: `${data.bookId}`, chapter: `${data.number}`, version: bible }))}>
            //                     <item.tag style={converted[`.eb-container .${item.className}`]} className={item.className}>{item.text}</item.tag>
            //                 </Pressable>
            //             </View>
            //         </View>
            //     )}
            // />
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
                                        <ErrorBoundary
                                            FallbackComponent={ErrorPage}>

                                            <RenderParsed />
                                        </ErrorBoundary>
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