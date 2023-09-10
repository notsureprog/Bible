import React from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'
import { ThemeContext } from './context/ThemeContext'
// import { ScrollView } from 'react-native-web'
// do not use semi colon on import due to errors, but yes everywhere else.

console.log(process.env.EXPO_PUBLIC_API_KEY)

const BibleSelectScreen = ({ navigation }) => {
    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode;
    const [data, setData] = React.useState(null);
    const [view, setView] = React.useState('BookSelect');
    const [bible, setBible] = React.useState('de4e12af7f28f599-01'); //de4e12af7f28f599-01 de4e12af7f28f599-02
    const [book, setBook] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    console.log(darkMode)

    // de4e12af7f28f599-02 - KJV
    // bba9f40183526463-01 - BSB

    const onClick = () => {
        if (darkMode) {
            theme.dispatch({ type: "LIGHTMODE" })
        }
        else {
            theme.dispatch({ type: "DARKMODE" })
        }
    }

    const BibleBooks = () => React.useMemo(() => {
        // I really just need a reset for the view rather than navigation.pop()
        // api key... I want private... maybe eas.json config...
        // 2073974de941e662df81167f889be71e
        // Like Genesis, Exodus, etc.. I figured it is better hard coded because it saves calling external resources.. plus it never changes.
        const selection = [

            { id: 'GEN', name: 'Genesis' },
            { id: 'EXO', name: 'Exodus' },
            { id: 'LEV', name: 'Leviticus' },
            { id: 'NUM', name: 'Numbers' },
            { id: 'DEU', name: 'Deuteronomy' },
            { id: 'JOS', name: 'Joshua' },
            { id: 'JDG', name: 'Judges' },
            { id: 'RUT', name: 'Ruth' },
            { id: '1SA', name: '1 Samuel' },
            { id: '2SA', name: '2 Samuel' },
            { id: '1KI', name: '1 Kings' },
            { id: '2KI', name: '2 Kings' },
            { id: '1CH', name: '1 Chronicles' },
            { id: '2CH', name: '2 Chronicles' },
            { id: 'EZR', name: 'Ezra' },
            { id: 'NEH', name: 'Nehemiah' },
            { id: 'EST', name: 'Ester' },
            { id: 'JOB', name: 'Job' },
            { id: 'PSA', name: 'Psalm' },
            { id: 'PRO', name: 'Proverbs' },
            { id: 'ECC', name: 'Ecclesiastes' },
            { id: 'SNG', name: 'Song of Solomon' },
            { id: 'ISA', name: 'Isaiah' },
            { id: 'JER', name: 'Jeremiah' },
            { id: 'LAM', name: 'Lamentations' },
            { id: 'EZK', name: 'Ezekiel' },
            { id: 'DAN', name: 'Daniel' },
            { id: 'HOS', name: 'Hosea' },
            { id: 'JOL', name: 'Joel' },
            { id: 'AMO', name: 'Amos' },
            { id: 'OBA', name: 'Obadiah' },
            { id: 'JON', name: 'Jonah' },
            { id: 'MIC', name: 'Micah' },
            { id: 'NAM', name: 'Nahum' },
            { id: 'HAB', name: 'Habukkuk' },
            { id: 'ZEP', name: 'Zephaniah' },
            { id: 'HAG', name: 'Haggai' },
            { id: 'ZEC', name: 'Zechariah' },
            { id: 'MAL', name: 'Malachi' },
            { id: '1ES', name: '1 Esdras' },
            { id: '2ES', name: '2 Esdras' },
            { id: 'TOB', name: 'Tobit' },
            { id: 'JDT', name: 'Judith' },
            { id: 'ESG', name: 'Esther Greek' },
            { id: 'WIS', name: 'Wisdom' },
            { id: 'SIR', name: 'Ecclesiasticus' },
            { id: 'BAR', name: 'Baruch' },
            { id: 'S3Y', name: 'Song of the Three' },
            { id: 'SUS', name: 'Susanna' },
            { id: 'BEL', name: 'Bel and the Dragon' },
            { id: 'MAN', name: 'Manasseh' },
            { id: '1MA', name: '1 Maccabees' },
            { id: '2MA', name: '2 Maccabees' },
            { id: 'MAT', name: 'Matthew' },
            { id: 'MRK', name: 'Mark' },
            { id: 'LUK', name: 'Luke' },
            { id: 'JHN', name: 'John' },
            { id: 'ACT', name: 'Acts' },
            { id: 'ROM', name: 'Romans' },
            { id: '1CO', name: '1 Corinthians' },
            { id: '2CO', name: '2 Corinthians' },
            { id: 'GAL', name: 'Galatians' },
            { id: 'EPH', name: 'Ephesians' },
            { id: 'PHP', name: 'Philippians' },
            { id: 'COL', name: 'Colossians' },
            { id: '1TH', name: '1 Thesselonians' },
            { id: '2TH', name: '2 Thesselonians' },
            { id: '1TI', name: '1 Timothy' },
            { id: '2TI', name: '2 Timothy' },
            { id: 'TIT', name: 'Titus' },
            { id: 'PHM', name: 'Philemon' },
            { id: 'HEB', name: 'Hebrews' },
            { id: 'JAS', name: 'James' },
            { id: '1PE', name: '1 Peter' },
            { id: '2PE', name: '2 Peter' },
            { id: '1JN', name: '1 John' },
            { id: '2JN', name: '2 John' },
            { id: '3JN', name: '3 John' },
            { id: 'JUD', name: 'Jude' },
            { id: 'REV', name: 'Revelation' },
        ]
        return (

            <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('Dummy')}>
                    <Text>Dummy</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => onClick()}>
                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                </TouchableOpacity>
                <FlatList
                    data={selection}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <TouchableOpacity onPress={() => { setBook(item.id); setLoading(true); setView('ChapterSelect') }}><Text style={{ fontSize: 30, margin: 10, color: darkMode ? styles.dark.color : styles.light.color }}>{item.name}</Text></TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        )

    }, [])

    const GetSelectOptions = async () => {
        if (loading && book !== null) {
            try {
                const options = {
                    method: 'GET',
                    url: `https://api.scripture.api.bible/v1/bibles/${bible}/books/${book}/chapters?fums-version=3`,
                    headers: {
                        // EXPO_PRIVATE
                        'api-key': ''
                    }
                }
                const result = await axios(options);
                setData(result.data.data);
                setLoading(false);
                console.log(result.data)
            }
            catch (err) {
                console.log(err)
            }
        }
    }

    console.log(data)
    React.useEffect(() => {
        GetSelectOptions()
    }, [view, book]) //should only fire once... I hard code the books of the bible, and the view will fire up the url for the api

    return (
        <View>
            {view === 'BookSelect' && !loading && data === null && book === null &&
                <BibleBooks />
            }
            {view === 'ChapterSelect' && book !== null && data !== null &&
                <View style={{ margin: 15, justifyContent: 'space-evenly', backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
                    <TouchableOpacity onPress={() => onClick()}>
                        <Text style={{color: darkMode ? styles.dark.color : styles.light.color}}>Theme</Text>
                    </TouchableOpacity>
                    {/* data.whatever */}
                    {/* data.id is the chapterId to pass into the next screen. */}
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                            // console.log(item)
                            <View>
                                <TouchableOpacity style={{ height: 30, width: 150, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} onPress={() => { navigation.navigate({ name: 'BibleScreen', params: { chapter: `${item.id}`, version: `${bible}` } }) }}>
                                    <Text style={{ color: darkMode ? styles.dark.color : styles.light.color, fontSize: 12 }}>{item.number}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <TouchableOpacity onPress={() => { setView('BookSelect'); setData(null); setBook(null); }}>
                        <Text style={{color: darkMode ? styles.dark.color : styles.light.color}}>Go Back</Text>
                    </TouchableOpacity>
                    {/* I like passing a param to another screen with what I need to read the bible... */}
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
    }
})

export default BibleSelectScreen