import React from 'react'
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native'
import { ThemeContext } from '../src/screens/context/ThemeContext'
import { useDispatch, useSelector } from 'react-redux'
import parse, { domToReact } from 'html-react-parser';
import sanitizeHTML from 'sanitize-html'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from './ErrorPage';



const RenderBibleOnWeb = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.authenticate.reducer)
    const theme = React.useContext(ThemeContext)
    const darkMode = theme.state.darkMode;
    const RenderParsed = () => {

        const parsedHTML = parse(html); //returns jsx elements, empty array, or string
        console.log(typeof parsedHTML);
        console.log(parsedHTML);
        const verses = [];
        let groupedVerse = [];

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

        if (Array.isArray(parsedHTML) === false && typeof parsedHTML === 'object') {
            console.log("The object")
            console.log(parsedHTML)
            if (Array.isArray(parsedHTML.props.children)) {
                parsedHTML.props.children.map((result) => {
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
                    data={verses}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {

                        const testToSeeIfVerseInDB = user.highlightedVerses.find(element => element.verse === item.verse && element.book === data.id.split('.')[0] && element.chapter === chapter.split('.')[1])
                        console.log(testToSeeIfVerseInDB)
                        return (
                            <View style={{ display: 'flex' }}>
                                <Pressable style={{
                                    color: darkMode ? styles.dark.color : styles.light.color,
                                    backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor
                                }}
                                    onPress={() => {
                                        // if the item matches something in the db, then it ought to take it out on press
                                        // if the item is not highlighted, it will highlight on press
                                        // probably need another db func to remove
                                        dispatch(typeof testToSeeIfVerseInDB === 'undefined' ? pushVersesToDatabase({ verse: item.verse, username: user.username, book: data.id.split('.')[0], chapter: chapter.split('.')[1], version: bible }) : removeVerseFromDatabase({ verse: item.verse, username: user.username, book: data.id.split('.')[0], chapter: chapter.split('.')[1], version: bible }));
                                        // if nothing matches theen it is undefined...
                                        // setHighlighted(typeof testToSeeIfVerseInDB === 'undefined' ? false : true)

                                    }}
                                >
                                    {item.text === null &&
                                        <View>
                                            <item.tag style={converted[`.eb-container .${item.className}`]}>{item.verse}</item.tag>
                                        </View>
                                    }
                                    {item.text !== null &&
                                        <View style={{ backgroundColor: typeof testToSeeIfVerseInDB !== 'undefined' ? 'yellow' : darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
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
    return (
        <View>
            <ErrorBoundary FallbackComponent={ErrorPage}>

                <RenderParsed />
            </ErrorBoundary>
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

export default RenderBibleOnWeb
