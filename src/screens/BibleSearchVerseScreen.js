import React from 'react'
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Platform, ScrollView, SafeAreaView } from 'react-native'
import axios from 'axios'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BIBLE_API_KEY } from '@env'
import VersionSelectMenu from '../../VersionSelectMenu'
// import { render } from 'react-dom'
// import { FlatList } from 'react-native-web'

const BibleSearchVerseScreen = ({ navigation }) => {
    const limitReducer = (state, action) => {
        if (action.type === "NEXT_PAGE") {
            return {
                limit: state.limit += 10 //less than data.length or whatever
            }
        }
        if (action.type === "PREVIOUS_PAGE") { //and limit is not 10
            return {
                limit: state.limit -= 10
            }
        }
    }


    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode;
    const [data, setData] = React.useState(null);
    const [bible, setBible] = React.useState('de4e12af7f28f599-02'); //although it could change depending on the version, but I am passing back to bible screen for more bible
    const [query, setQuery] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [limitState, limitDispatch] = React.useReducer(limitReducer, { limit: 0 });

    const inputRef = React.useRef(null);

    // clear the search input after i search for a word/verse
    const ClearInput = () => {
        inputRef.current.value = "";
    }

    const OnFocus = () => {
        inputRef.current.focus()
    }

    const InputFunction = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <MaterialCommunityIcons name='magnify' size={50} />
                <TextInput style={{width: '100%'}} onFocus={OnFocus} ref={inputRef} placeholder='Enter a phrase' onSubmitEditing={(text) => { setQuery(text.nativeEvent.text); ClearInput(); setLoading(true); }} />
            </View>
        )
    }

    console.log(bible)


    const handleTheme = () => {

        if (darkMode) {
            theme.dispatch({ type: "LIGHTMODE" })
        } else {
            theme.dispatch({ type: "DARKMODE" })
        }
    }



    console.log(limitState.limit)

    const SearchVerse = async () => {
        if (loading) {
            try {
                const options = {
                    method: 'GET',
                    url: `https://api.scripture.api.bible/v1/bibles/${bible}/search?query=${query}&offset=${limitState.limit}`,
                    headers: {
                        'api-key': `${BIBLE_API_KEY}`
                    }
                }
                const result = await axios(options, {
                    validateStatus: function (status) {
                        return status < 500
                    }
                });
                setData(result.data.data);
                setLoading(false);
                console.log(result.data.data);

            }
            catch (err) {
                if (err.response) {
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else if (err.request) {
                    console.log(err.request);
                } else {
                    console.log(err.config);
                }
                console.log(err);
            }
        }
    }

    const VerseDisplay = ({ main }) => {
        return (
            <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                {/* want 1-10, 11-20, 21-30 etc... verses is always going to be 10 */}
                {main.verses.map((result) => (
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 24, color: darkMode ? styles.dark.color : styles.light.color }}>{result.reference}</Text>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>{result.text}</Text>
                        <Pressable style={{ borderColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => navigation.navigate({ name: 'BibleScreen', params: { chapter: `${result.chapterId}`, version: `${bible}` } })}>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Go to verse</Text>
                        </Pressable>
                    </View>
                ))}

            </View>
        )
    }

    const renderItem = ({ item }) => (
        <VerseDisplay main={item} />
        // whatever else?
    )



    console.log(darkMode);



    React.useEffect(() => {
        SearchVerse()
    }, [query, limitState.limit]) //maybe just loading...
    return (
        <View>
            {loading && data !== null &&
                <View>
                    <Text>Loading, please wait...</Text>
                </View>
            }

            <InputFunction />

            <VersionSelectMenu />
            {data !== null && !loading &&
                <View>

                    {Platform.OS === 'android' &&

                        <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, marginBottom: 20 }}>
                            <Pressable onPress={() => handleTheme()}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                            </Pressable>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>{data.total} Results found for {query}: </Text>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Every match for a phrase is listed below...</Text>
                            <FlatList
                                data={[data]}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                            />
                            <Pressable onPress={() => { limitDispatch({ type: "NEXT_PAGE" }); setLoading(true); }}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Next Page</Text>
                            </Pressable>
                            <Pressable onPress={() => { limitDispatch({ type: "PREVIOUS_PAGE" }); setLoading(true); }}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Previous Page</Text>
                            </Pressable>
                        </View>
                    }
                    {Platform.OS === 'ios' &&

                        <SafeAreaView style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                            <Pressable onPress={() => handleTheme()}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                            </Pressable>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>{data.total} Results found for {query}: </Text>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Every match for a phrase is listed below...</Text>
                            <FlatList
                                data={[data]}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                            />
                            <Pressable onPress={() => { limitDispatch({ type: "NEXT_PAGE" }); setLoading(true); }}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Next Page</Text>
                            </Pressable>
                            <Pressable onPress={() => { limitDispatch({ type: "PREVIOUS_PAGE" }); setLoading(true); }}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Previous Page</Text>
                            </Pressable>
                        </SafeAreaView>
                    }
                    {Platform.OS === 'web' &&

                        <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                            <Pressable onPress={() => handleTheme()}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                            </Pressable>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>{data.total} Results found for {query}: </Text>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Every match for a phrase is listed below...</Text>
                            <FlatList
                                data={[data]}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                            />
                            <Pressable onPress={() => { limitDispatch({ type: "NEXT_PAGE" }); setLoading(true); }}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Next Page</Text>
                            </Pressable>
                            <Pressable onPress={() => { limitDispatch({ type: "PREVIOUS_PAGE" }); setLoading(true); }}>
                                <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Previous Page</Text>
                            </Pressable>
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
        color: '#000000'
    },
    main: {
        flex: 3
    },
    bibleGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        overflow: 'scroll'
    },

})

export default BibleSearchVerseScreen
