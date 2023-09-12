import React from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
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
    const [limitState, limitDispatch] = React.useReducer(limitReducer, { limit: 10 });
    // a lot of repetition...
    const [version, setVersion] = React.useState([
        { label: 'KJV', value: 'de4e12af7f28f599-01' },
        { label: 'ASV', value: '06125adad2d5898a-01' },
        { label: 'WEB', value: '9879dbb7cfe39e4d-03' },
        { label: 'WEBBE', value: '7142879509583d59-04' },
        // { label: 'ASVBT', value: '685d1470fe4d5c3b-01' },
        // { label: 'BSB', value: 'bba9f40183526463-01' },
        // { label: 'KJVCPB', value: '55212e3cf5d04d49-01' },
        // { label: 'DRA', value: '179568874c45066f-01' },
        // { label: 'EMTV', value: '55ec700d9e0d77ea-01' },
        // { label: 'GNV', value: 'c315fa9f71d4af3a-01' },
        // { label: 'LSV', value: '01b29f4b342acc35-01' },
        // { label: 'RV', value: '40072c4a5aba4022-01' },
        // { label: 'TCENT', value: '32339cf2f720ff8e-01' },
        // { label: 'TOJB', value: 'c89622d31b60c444-02' },
        // { label: 'WMB', value: 'f72b840c855f362c-04' },
        // { label: 'WMBBE', value: '04da588535d2f823-04' },
    ]);

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

    const SearchVerse = async () => {
        if (loading) {
            try {
                const options = {
                    method: 'GET',
                    url: `https://api.scripture.api.bible/v1/bibles/${bible}/search?query=${query}`,
                    headers: {
                        'api-key': ''
                    }
                }
                const result = await axios(options);
                // if result.data.data.something.matches(query)
                setData(result.data.data);
                console.log(result.data.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const VerseDisplay = ({ main }) => {
        return (
            <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                {main.verses.map((result) => (
                    <View style={{padding: 10}}>
                        <Text style={{ fontSize: 24, color: darkMode ? styles.dark.color : styles.light.color }}>{result.reference}</Text>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>{result.text}</Text>
                        <TouchableOpacity style={{borderColor: darkMode ? styles.dark.color : styles.light.color}} onPress={() => navigation.navigate({ name: 'BibleScreen', params: { chapter: `${result.chapterId}`, version: `${bible}` } })}>
                            <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Go to verse</Text>
                        </TouchableOpacity>
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
    // const computeDifference = (num1, num2) => {
    //     const difference = num2 - num1;
    //     return (
    //         difference
    //     )
    // }

    console.log(darkMode);

    // console.log(computeDifference(limitState.limit, data.total))

    // computeDifference(limitState.limit, data.total)
    React.useEffect(() => {
        SearchVerse()
    }, [query])
    return (
        <View>
            {/* problem for onchangetext. it will run the api once, and then does the text default back to nothing? */}
            <TextInput placeholder='Search for a verse' onSubmitEditing={(text) => { setQuery(text.nativeEvent.text); setLoading(true) }} />
            {data !== null && !loading &&
                <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                    <TouchableOpacity onPress={() => handleTheme()}>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                    </TouchableOpacity>
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>{data.total} Results found for {query}: </Text>
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Every match for a phrase is listed below...</Text>
                    <FlatList
                        data={[data]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                    <TouchableOpacity onPress={() => limitDispatch({type: "NEXT_PAGE"})}>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Next Page</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => limitDispatch("PREVIOUS_PAGE")}>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Previous Page</Text>
                    </TouchableOpacity>
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
