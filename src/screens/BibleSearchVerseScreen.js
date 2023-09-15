import React from 'react'
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, Platform, ScrollView, SafeAreaView } from 'react-native'
import axios from 'axios'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
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
    // a lot of repetition... make a function
    // const [version, setVersion] = React.useState([
    //     { label: 'KJV', value: 'de4e12af7f28f599-01' },
    //     { label: 'ASV', value: '06125adad2d5898a-01' },
    //     { label: 'WEB', value: '9879dbb7cfe39e4d-03' },
    //     { label: 'WEBBE', value: '7142879509583d59-04' },
    //     // { label: 'ASVBT', value: '685d1470fe4d5c3b-01' },
    //     // { label: 'BSB', value: 'bba9f40183526463-01' },
    //     // { label: 'KJVCPB', value: '55212e3cf5d04d49-01' },
    //     // { label: 'DRA', value: '179568874c45066f-01' },
    //     // { label: 'EMTV', value: '55ec700d9e0d77ea-01' },
    //     // { label: 'GNV', value: 'c315fa9f71d4af3a-01' },
    //     // { label: 'LSV', value: '01b29f4b342acc35-01' },
    //     // { label: 'RV', value: '40072c4a5aba4022-01' },
    //     // { label: 'TCENT', value: '32339cf2f720ff8e-01' },
    //     // { label: 'TOJB', value: 'c89622d31b60c444-02' },
    //     // { label: 'WMB', value: 'f72b840c855f362c-04' },
    //     // { label: 'WMBBE', value: '04da588535d2f823-04' },
    // ]);
    const inputRef = React.useRef(null);

    // clear the search input after i search for a word/verse
    const ClearInput = () => {
        inputRef.current.value = "";
    }
    //focus on the text input. little blue outline
    const OnFocus = () => {
        inputRef.current.focus()
    }

    const InputFunction = () => {
        return (
            <TextInput onFocus={OnFocus} ref={inputRef} placeholder='Enter a phrase' onSubmitEditing={(text) => { setQuery(text.nativeEvent.text); ClearInput(); setLoading(true); }} />
        )
    }

    console.log(bible)

    // repetition
    const handleTheme = () => {

        if (darkMode) {
            theme.dispatch({ type: "LIGHTMODE" })
        } else {
            theme.dispatch({ type: "DARKMODE" })
        }
    }

    // const testQuery = (obj, phrase) => {
    //     const testObj = obj
    //     if (obj in phrase === query) {
    //         return 
    //     }
    // }

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
                // if result.data.data.something.matches(query)
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

    // i may need a sum instead and compare it to total in 
    // const computeDifference = (num1, num2) => {
    //     const difference = num2 - num1;
    //     // if (num1 + num2) >= data.total -- then go back button only
    //     // if num2 - num1 <= 0 then go forward button only...
    //     return (
    //         difference
    //     )
    // }

    // const computeSum = (num1, num2) => {
    //     const sum = num1 + num2;
    //     return (
    //         sum
    //     )
    // }

    // if (data !== null) {
    //     if (computeDifference(limitState.limit, data.total) <= )
    //         const pageResult = computeDifference(limitState.limit, data.total);
    //     return pageResult
    //     // console.log(computeDifference(limitState.limit, data.total))
    // }

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

    // const VersionSelect = () => {
    //     // brain fog
    // }

    // I dont even think I need to compute the difference. It will just display whatever. like if there is only 8 results, and the limit is 10, then it will display 8, but it could be handy for 11-20, 21- 30


    console.log(darkMode);

    // console.log(computeDifference(limitState.limit, data.total))

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
            {/* setBible is not defined */}
            <VersionSelectMenu />
            {data !== null && !loading &&
                <View>
                    {/* scrollview renders every single item in the list. (it will be 10 in this case. I am going for more performant though) */}
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
