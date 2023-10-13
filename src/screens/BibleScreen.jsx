import React from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Platform } from 'react-native'
import axios from 'axios'
import { HTMLElementModel, RenderHTML, HTMLContentModel } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
import DropDownPicker from 'react-native-dropdown-picker'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { EXPO_PUBLIC_API_URL, BIBLE_API_KEY } from '@env'
import VersionSelectMenu from '../../VersionSelectMenu'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useJwt from '../../hooks/useJwt'
// import * as scriptureStyles from '../../css/scripture.css'

// https://www.w3schools.com/react/react_jsx.asp
/*
JSX stands for JavaScript XML.

JSX allows us to write HTML in React.

JSX makes it easier to write and add HTML in React.
*/

// idk if theyre all spans
// data-sid is in the db when i click the verse however it needs to be converted to, for example, LEV.5.2 instead of LEV 5:2
// https://github.com/meliorence/react-native-render-html/blob/v6.3.1/packages/render-html/src/TNodeRenderer.tsx



// Example of what I am Thinking - <${css}><${html}></${css}>

console.log(BIBLE_API_KEY)
console.log(VersionSelectMenu)

// using route.params for token could be undefined if I pass it in pressable.
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
    // const [open, setOpen] = React.useState(false);
    // const [haveVersion, setHaveVersion] = React.useState();
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
    const [chapter, setChapter] = React.useState(route.params.chapter !== undefined ? route.params.chapter : 'GEN.1');
    console.log(chapter)
    const [bible, setBible] = React.useState(route.params.version !== undefined ? route.params.version : 'de4e12af7f28f599-01');
    console.log(bible)
    const [data, setData] = React.useState(0); //data is an array of objects and not a fn which i could use deps of something other than chapter because chapter changes all the time

    if (data !== null) {
        console.log(Object.values(data)) //array
    }

    const customHTMLElementModels = {
        'dynamic-font': HTMLElementModel.fromCustomModel({
            tagName: 'dynamic-font',
            mixedUAStyles: {
                color: darkMode ? styles.dark.color : styles.light.color,
                fontSize: fontState.size,
                
            },
            contentModel: HTMLContentModel.block
        })
    }

    


    // console.log(chapter)
    console.log(darkMode)
    console.log(bible)
    // console.log(haveVersion)
    // https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/GEN.1/verses

    const GetVerse = async () => {
        try {
            const options = {
                method: 'GET',
                url: `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}`,
                // // url: `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/GEN.1/`,
                headers: {
                    'api-key': `${BIBLE_API_KEY}`
                }
            }

            const result = await axios(options);
            console.log(result.data.data); //not an array
            setData(result.data.data);
            // const test = document.getElementsByTagName('p').outerHTML
            // console.log(test);
        } catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        GetVerse() //for api call
    }, [chapter, bible]) //component unmount? take out chapter and use it as a dep in memo.. chapter as a dep previously

    return (
        <View style={{ color: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor, borderColor: darkMode ? styles.dark.color : styles.light.color }}>
            {/* undefined actually. I keep seeing undefined. on render on android. without ngrok on client. */}
            {data !== null && 
                <View>
                    <Text style={{ marginLeft: '25%', marginRight: '25%', color: darkMode ? styles.dark.color : styles.light.color, fontSize: 35 }}>{data.reference}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        {/* This version select menu buttons do not like being clicked */}
                        <VersionSelectMenu style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} />
                    </View>
                    {/* <Text style={{ color: darkMode ? styles.dark.color : styles.light.color }}>Theme</Text>
                    <Pressable style={{ width: 30, height: 30, borderColor: darkMode ? styles.dark.color : styles.light.color, backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }} onPress={() => onClick()}>
                        <MaterialCommunityIcons name="theme-light-dark" style={{ marginTop: 5, color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                    </Pressable> */}
                    {/* I could go back to the bible select screen, but i kind of like it to go back to search if i searched too */}
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
                    {/* This below needs to be scrollview probably. ngrok doesnt care, but expo qr does. */}
                    {Platform.OS === 'android' &&
                        <View>
                            {data.id === 'GEN.intro' &&
                                <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                    <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                        <Text>{data.next.bookId} {data.next.number}</Text>
                                    </Pressable>
                                </View>
                            }
                            {data.id === 'REV.22' &&
                                <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>
                                    {/* data.content is like <p class='p'></p><p class='Gen'></p><p id='GEN.1.1'></p> etc... and scripture styles hits those */}
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                    <Pressable style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                        <Text>{data.previous.bookId} {data.previous.number}</Text>
                                    </Pressable>
                                    {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View style={{ padding: 10, marginBottom: 100, borderWidth: 4, borderColor: '#333', marginTop: 100 }}>
                                    {/* <Pressable style={{ backgroundColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => fontDispatch({ type: "INCREASE_FONT" })}>
                                    <Text>Increase</Text>
                                </Pressable>
                                <Pressable style={{ backgroundColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => fontDispatch({ type: "DECREASE_FONT" })}>
                                    <Text>Decrease</Text>
                                </Pressable> */}
                                    {/* idk if this is right, but setChapter is a function i do know */}


                                    {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                    {/* classesStyles={classesStyles.scriptureStyles} */}
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                    {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(30,200,0,0.3)' }} */}
                                    <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>

                                        <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            {/* <Text>{data.previous.bookId} {data.previous.number}</Text> */}
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>

                                        {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(200,0,30,0.3)' }} */}
                                        <Pressable style={{ paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                            {/* <Text>{data.next.bookId} {data.next.number}</Text> */}
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
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                </View>
                            }
                            {data.id === 'REV.22' &&
                                <View>
                                    <Pressable style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                        <Text>{data.previous.bookId} {data.previous.number}</Text>
                                    </Pressable>
                                    {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View style={{ padding: 10, marginBottom: 100, borderWidth: 4, borderColor: '#333', marginTop: 100 }}>
                                    {/* <Pressable style={{ backgroundColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => fontDispatch({ type: "INCREASE_FONT" })}>
                                    <Text>Increase</Text>
                                </Pressable>
                                <Pressable style={{ backgroundColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => fontDispatch({ type: "DECREASE_FONT" })}>
                                    <Text>Decrease</Text>
                                </Pressable> */}
                                    {/* idk if this is right, but setChapter is a function i do know */}


                                    {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                    {/* classesStyles={classesStyles.scriptureStyles} */}
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                    {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(30,200,0,0.3)' }} */}
                                    <View style={{ display: 'flex', borderColor: 'black', borderWidth: 2, position: 'relative' }}>

                                        <Pressable style={{ flexDirection: 'row' }} onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            {/* <Text>{data.previous.bookId} {data.previous.number}</Text> */}
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color }} size={30} />
                                        </Pressable>

                                        {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(200,0,30,0.3)' }} */}
                                        <Pressable style={{ paddingTop: '50%', paddingLeft: '25%', marginLeft: '25%' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                            {/* <Text>{data.next.bookId} {data.next.number}</Text> */}
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
                                <View style={{ padding: 10, borderWidth: 1, borderColor: '#333' }}>
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                            {/* <Text>{data.next.bookId} {data.next.number}</Text> */}
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                    </View>
                                </View>
                            }
                            {data.id === 'REV.22' &&
                                <View style={{ padding: 10, borderWidth: 1, borderColor: '#333' }}>
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<dynamic-font>${data.content}</dynamic-font>` }} />
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            {/* <Text>{data.next.bookId} {data.next.number}</Text> */}
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                    </View>
                                </View>
                            }
                            {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&

                                <View style={{ padding: 10, borderWidth: 1, borderColor: '#333' }}>
                                    {/* <Pressable style={{ backgroundColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => fontDispatch({ type: "INCREASE_FONT" })}>
                                    <Text>Increase</Text>
                                </Pressable>
                                <Pressable style={{ backgroundColor: darkMode ? styles.dark.color : styles.light.color }} onPress={() => fontDispatch({ type: "DECREASE_FONT" })}>
                                    <Text>Decrease</Text>
                                </Pressable> */}
                                    {/* idk if this is right, but setChapter is a function i do know */}


                                    {/* <RenderHTML source={{ html: `${data.content}` }} /> */}
                                    {/* classesStyles={classesStyles.scriptureStyles} */}
                                    <RenderHTML customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
                                    {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(30,200,0,0.3)' }} */}
                                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                        <Pressable onPress={() => { setChapter(`${data.previous.id}`) }}>
                                            {/* <Text>{data.next.bookId} {data.next.number}</Text> */}
                                            <AntDesign name='leftcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>
                                        <Pressable onPress={() => { setChapter(`${data.next.id}`) }}>
                                            {/* <Text>{data.previous.bookId} {data.previous.number}</Text> */}
                                            <AntDesign name='rightcircle' style={{ color: darkMode ? styles.dark.color : styles.light.color, height: 50, width: 50 }} size={30} />
                                        </Pressable>

                                        {/* style={{ height: 30, width: 125, backgroundColor: 'rgba(200,0,30,0.3)' }} */}
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
