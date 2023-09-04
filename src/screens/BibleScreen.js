import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import axios from 'axios'
import { RenderHTML } from 'react-native-render-html'
import { ThemeContext } from './context/ThemeContext'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'

// so really the only buttons i will be pressing - in terms of data changing - is next and previous. and setData (function) changes according to that. I want to cache data (state variable) if i visit that same verse.

const BibleScreen = ({ navigation, route }) => {
    const theme = React.useContext(ThemeContext);
    const darkMode = theme.state.darkMode;
    const [chapter, setChapter] = React.useState(route.params.chapter);
    const [bible, setBible] = React.useState(route.params.version);
    const [data, setData] = React.useState(null);

    // const themeReducer = (state, action) => {
    //     switch (action.type) {
    //         case "LIGHTMODE":
    //             return { darkMode: false };
    //         case "DARKMODE":
    //             return { darkMode: true };
    //         default:
    //             return state;
    //     }
    // }
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
            <Dropdown>
                <Dropdown.Toggle variant='success' id="dropdown-basic">
                    Version
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setBible('de4e12af7f28f599-01')}>Action 1</Dropdown.Item>
                    <Dropdown.Item onClick={() => setBible('06125adad2d5898a-01')}>Action 2</Dropdown.Item>
                    <Dropdown.Item onClick={() => setBible('9879dbb7cfe39e4d-03')}>Action 3</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    // const VersionSelectMenu = React.forwardRef(({ children }, ref) => {
    //     return (
    //         <View>

    //             {/* <Form.Control

    //                 autoFocus
    //                 onChange={(e) => setBible(e.target.value)}
    //             // value={bible}
    //             /> */}
    //             {/* <TouchableOpacity onClick={() => setBible('de4e12af7f28f599-01')}><Text>KJV</Text></TouchableOpacity>
    //             <TouchableOpacity onClick={() => setBible('06125adad2d5898a-01')}><Text>ASV</Text></TouchableOpacity>
    //             <TouchableOpacity onClick={() => setBible('9879dbb7cfe39e4d-03')}><Text>WEB</Text></TouchableOpacity> */}
    //             {/* <ul> */}
                    
    //                 {/* {React.Children.toArray(children).filter((child) => !bible || child.props.children.toLowerCase().startsWith(bible))} */}
    //             {/* </ul> */}
    //         </View>
    //     )
    // })
    console.log(chapter)
    console.log(darkMode)
    console.log(bible)
    // https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/GEN.1/verses
    const GetVerse = async () => {
        try {
            const options = {
                method: 'GET',
                url: `https://api.scripture.api.bible/v1/bibles/${bible}/chapters/${chapter}`,
                // url: `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/GEN.1/verses`,
                headers: {
                    'api-key': '64a594186127bbd1c9dba6e9f71d58f6'
                }
            }

            const result = await axios(options);
            console.log(result.data.data);
            setData(result.data.data);
        } catch (err) {
            console.log(err)
        }
    }

    React.useEffect(() => {
        GetVerse()
    }, [chapter, bible])

    return (
        <View style={{ backgroundColor: darkMode ? styles.dark.backgroundColor : styles.light.backgroundColor }}>
            {data !== null &&
                <View>
                    
                    <TouchableOpacity onPress={() => onClick()}>
                        <Text>Theme</Text>
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
                                <RenderHTML source={{ html: `<div style='color: <script>darkMode ? styles.dark.color : styles.light.color</script>'>${data.content}</div>` }} />
                            </View>
                        }
                        {data.id === 'REV.22' &&
                            <View>
                                <TouchableOpacity style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                    <Text>{data.previous.bookId} {data.previous.number}</Text>
                                </TouchableOpacity>
                                <RenderHTML source={{ html: `${data.content}` }} />
                            </View>
                        }
                        {data.id !== 'GEN.intro' && data.id !== 'REV.22' &&
                            <View>
                                <TouchableOpacity style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => setChapter(`${data.previous.id}`)}>
                                    <Text>{data.previous.bookId} {data.previous.number}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 30, width: 25, backgroundColor: 'red' }} onPress={() => { setChapter(`${data.next.id}`) }}>
                                    <Text>{data.next.bookId} {data.next.number}</Text>
                                </TouchableOpacity>
                                <RenderHTML source={{ html: `${data.content}` }} />
                            </View>
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
        backgroundColor: '#999a9c',
        color: '#ffffff'
    },
    light: {
        backgroundColor: '#ffffff',
        color: '#000000'
    }
})

export default BibleScreen
