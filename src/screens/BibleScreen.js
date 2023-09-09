import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native'
import axios from 'axios'
import { HTMLElementModel, RenderHTML, HTMLContentModel } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Form from 'react-bootstrap/Form'

// so really the only buttons i will be pressing - in terms of data changing - is next and previous. and setData (function) changes according to that. I want to cache data (state variable) if i visit that same verse.

const BibleScreen = ({ navigation, route }) => {
    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode;
    const [open, setOpen] = React.useState(false);
    const [haveVersion, setHaveVersion] = React.useState();
    const [version, setVersion] = React.useState([
        { label: 'KJV', value: 'de4e12af7f28f599-01' },
        { label: 'ASV', value: '06125adad2d5898a-01' },
        { label: 'WEB', value: '9879dbb7cfe39e4d-03' },

    ])
    const [chapter, setChapter] = React.useState(route.params.chapter);
    const [bible, setBible] = React.useState(route.params.version);

    const [data, setData] = React.useState(null); //data is an array of objects and not a fn which i could use deps of something other than chapter because chapter changes all the time


    if (data !== null) {

        console.log(Object.values(data)) //array
    }

    const customHTMLElementModels = {
        'dynamic-font-color': HTMLElementModel.fromCustomModel({
            tagName: 'dynamic-font-color',
            mixedUAStyles: {
                color: darkMode ? styles.dark.color : styles.light.color
            },
            contentModel: HTMLContentModel.block
        })
    }

    const onOpen = React.useCallback(() => {
        setOpen(!open);
    })

    const onClick = () => {
        if (darkMode) {
            theme.dispatch({ type: "LIGHTMODE" })
        }
        else {
            theme.dispatch({ type: "DARKMODE" })
        }
    }

    const VersionSelectMenu = () => {
        return (
            <View style={{ marginRight: 0, width: 175 }}>
                <DropDownPicker
                    placeholder='Select a Version'
                    open={open}
                    value={haveVersion}
                    items={version}
                    setOpen={() => onOpen()}
                    // i guess it will be undefined on the first iteration
                    setValue={(val) => setBible(val)}
                // setItems={setVersion}
                />
            </View>

        )
    }


    console.log(chapter)
    console.log(darkMode)
    console.log(bible)
    console.log(haveVersion)
    // https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/GEN.1/verses
    const GetVerse = async () => {
        try {
            const options = {
                method: 'GET',
                // url: 'https://f0207add-c929-4273-85cd-7030e30c0a8a.mock.pstmn.io/Bibles' // taken off :)
                url: `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}`,
                // // url: `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/GEN.1/`,
                headers: {
                    'api-key': '' //regenerated :)
                }
            }

            const result = await axios(options);
            console.log(result.data.data); //not an array
            setData(result.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        GetVerse() //for api call
    }, [chapter, bible]) //component unmount? take out chapter and use it as a dep in memo.. chapter as a dep previously

    return (
        <View style={{ color: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color, borderWidth: 10, borderStyle: 'solid' }}>
            {data !== null &&
                <View>
                    <TextInput placeholder='Search for a verse' onSubmitEditing={() => console.log('I want a verse to be handled and match')} />
                    <TouchableOpacity style={{ height: 30, width: 125, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} onPress={() => onClick()}>
                        <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.pop(1)}>
                        <Text>Go Back</Text>
                    </TouchableOpacity>

                    <View>
                        {data.id === 'GEN.intro' &&
                            <View>
                                <TouchableOpacity onPress={() => { setChapter(`${data.next.id}`) }}>
                                    <Text>{data.next.bookId} {data.next.number}</Text>
                                </TouchableOpacity>
                                <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div style='color: ${darkMode} ? ${styles.dark.color} : ${styles.light.color}'>${data.content}</div>` }} />
                            </View>
                        }
                        {data.id === 'REV.22' &&
                            <View>
                                <TouchableOpacity style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                    <Text>{data.previous.bookId} {data.previous.number}</Text>
                                </TouchableOpacity>
                                {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                <RenderHTML source={{ html: `<div style='color: ${darkMode} ? ${styles.dark.color} : ${styles.light.color}'>${data.content}</div>` }} />
                            </View>
                        }
                        {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&
                            <ScrollView style={{ marginBottom: 75 }}>
                                {/* idk if this is right, but setChapter is a function i do know */}
                                <TouchableOpacity style={{ height: 30, width: 125, backgroundColor: 'rgba(30,200,0,0.3)' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                    <Text>{data.previous.bookId} {data.previous.number}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 30, width: 125, backgroundColor: 'rgba(200,0,30,0.3)' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                    <Text>{data.next.bookId} {data.next.number}</Text>
                                </TouchableOpacity>
                                {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font-color>${data.content}</dynamic-font-color>` }} />
                            </ScrollView>
                        }
                    </View>
                        <VersionSelectMenu />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dark: {
        backgroundColor: '#000000',
        color: '#ffffff'
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000'
    }
})

export default BibleScreen
