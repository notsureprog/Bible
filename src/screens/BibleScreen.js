import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native'
import axios from 'axios'
import { HTMLElementModel, RenderHTML, HTMLContentModel } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
// import * as scriptureStyles from "../../node_modules/scripture-styles/dist/css/scripture-styles.css"

// console.log(scriptureStyles)
// import "/scripture-styles/dist/css/scripture-styles.css"
// import DropdownButton from 'react-bootstrap/DropdownButton'
// import Form from 'react-bootstrap/Form'

// so really the only buttons i will be pressing - in terms of data changing - is next and previous. and setData (function) changes according to that. I want to cache data (state variable) if i visit that same verse.

const BibleScreen = ({ navigation, route }) => {
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
    const [open, setOpen] = React.useState(false);
    const [haveVersion, setHaveVersion] = React.useState();
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
                color: darkMode ? styles.dark.color : styles.light.color,
                fontSize: fontState.size
            },
            contentModel: HTMLContentModel.block
        })
    }

    // const classesStyles = {
    //     // needs to be an object
    //     scriptureStyles: scriptureStyles
    // }

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
            // flex if only not 1, but idk. I may be able to pull off without flexing.
            <View style={{ width: 175, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
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
        <View style={{ color: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }}>
            {data !== null &&
                <View>
                    <Text style={{ marginLeft: '25%', marginRight: '25%', color: darkMode ? styles.dark.color : styles.light.color, fontSize: 35 }}>{data.reference}</Text>
                    {/* it is not really even white space. I think it is a p tag with a style to put space. it is <p class="p"></p> */}
                    {/* onChangeText={(text) => searchData(text.nativeEvent.text)} onSubmitEditing={(text) => console.log('I kind of would not mind onChangeText suggesting a verse on each keystroke, but the api calls could rack up more (5000 limit)')} but either way I am going to have to have a baseUrl in axios, and then maybe switch a view for the search and the actual chapter being read. OR I could redirect the user to an entirely different page, and then redirect back here (since it does have route.params.whatever (which needs an OR)) */}
                    <TextInput style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, color: darkMode ? styles.dark.color : styles.light.color, borderColor: darkMode ? styles.dark.color : styles.light.color }} placeholder='Search for a verse' />
                    <VersionSelectMenu />
                    <TouchableOpacity style={{ height: 30, width: 125, borderColor: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} onPress={() => onClick()}>
                        <MaterialCommunityIcons name="theme-light-dark" style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ height: 30, width: 125, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => navigation.pop(1)}>
                        <Text style={{ height: 30, width: 125, color: darkMode ? styles.dark.color : styles.light.color }}>Go Back</Text>
                    </TouchableOpacity>
                    <Text>Change the Font Size:</Text>
                    <TouchableOpacity style={{ paddingBottom: 0, paddingLeft: 30 }} onPress={() => fontDispatch({ type: "INCREASE_FONT" })}>
                        <AntDesign name="pluscircle" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingBottom: -30, paddingLeft: 0 }} onPress={() => fontDispatch({ type: "DECREASE_FONT" })}>
                        <AntDesign name="minuscircle" size={30} />
                    </TouchableOpacity>


                    <View>
                        {data.id === 'GEN.intro' &&
                            <View>
                                <TouchableOpacity onPress={() => { setChapter(`${data.next.id}`) }}>
                                    <Text>{data.next.bookId} {data.next.number}</Text>
                                </TouchableOpacity>
                                <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font-color>${data.content}</dynamic-font-color>` }} />
                            </View>
                        }
                        {data.id === 'REV.22' &&
                            <ScrollView>
                                <TouchableOpacity style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                    <Text>{data.previous.bookId} {data.previous.number}</Text>
                                </TouchableOpacity>
                                {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font-color>${data.content}</dynamic-font-color>` }} />
                            </ScrollView>
                        }
                        {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                            <ScrollView style={{ padding: 10, marginBottom: 100, borderWidth: 4, borderColor: '#333', marginTop: 100 }}>
                                {/* <TouchableOpacity onPress={() => fontDispatch({type: "INCREASE_FONT"})}>
                                    <Text>Increase</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => fontDispatch({type: "DECREASE_FONT"})}>
                                    <Text>Decrease</Text>
                                </TouchableOpacity> */}
                                {/* idk if this is right, but setChapter is a function i do know */}


                                {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                {/* classesStyles={classesStyles.scriptureStyles} */}
                                <RenderHTML  customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font-color>${data.content}</dynamic-font-color></div>` }} />
                                {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(30,200,0,0.3)' }} */}
                                <View style={{display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative'}}>
                                    <TouchableOpacity style={{flexDirection: 'row' ,  }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                        {/* <Text>{data.previous.bookId} {data.previous.number}</Text> */}
                                        <AntDesign name="rightcircle" size={30} />
                                    </TouchableOpacity>

                                    {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(200,0,30,0.3)' }} */}
                                    <TouchableOpacity style={{paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                        {/* <Text>{data.next.bookId} {data.next.number}</Text> */}
                                        <AntDesign name="leftcircle" size={30} />
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>
                        }
                    </View>

                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    // leave it out of every file, and put it in header in app
    dark: {
        backgroundColor: '#000000',
        color: '#ffffff',

        // borderWidth: 1
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000',

        // borderWidth: 1
    },
    main: {
        flex: 3
    }
})

export default BibleScreen
