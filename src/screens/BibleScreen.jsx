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
const scriptureStyles = [{"eb_container":{"background":"none"},"eb_container_html":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_body":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_div":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_span":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_applet":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_object":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_iframe":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_h1":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_h2":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_h3":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_h4":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_h5":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_h6":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_p":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_blockquote":{"quotes":"none"},"eb_container_pre":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_a":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_abbr":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_acronym":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_address":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_big":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_cite":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_code":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_del":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_dfn":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_em":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_img":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_ins":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_kbd":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_q":{"quotes":"none"},"eb_container_s":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_samp":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_small":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_strike":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_strong":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_sub":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_sup":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_tt":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_var":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_b":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_u":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_i":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_center":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_dl":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_dt":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_dd":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_ol":{"listStyle":"none"},"eb_container_ul":{"listStyle":"none"},"eb_container_li":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_fieldset":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_form":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_label":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_legend":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_table":{"width":"100%","display":"table"},"eb_container_caption":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_tbody":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_tfoot":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_thead":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_tr":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_th":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_td":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_article":{"display":"block"},"eb_container_aside":{"display":"block"},"eb_container_canvas":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_details":{"display":"block"},"eb_container_embed":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_figure":{"display":"block"},"eb_container_figcaption":{"display":"block"},"eb_container_footer":{"display":"block"},"eb_container_header":{"display":"block"},"eb_container_hgroup":{"display":"block"},"eb_container_menu":{"display":"block"},"eb_container_nav":{"display":"block"},"eb_container_output":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_ruby":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_section":{"display":"block"},"eb_container_summary":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_time":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_mark":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_audio":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_video":{"margin":"0","padding":"0","border":"0","fontSize":"100%","font":"inherit","verticalAlign":"baseline"},"eb_container_blockquote_before":{"content":"none"},"eb_container_blockquote_after":{"content":"none"},"eb_container_q_before":{"content":"none"},"eb_container_q_after":{"content":"none"},"eb_container__c":{"textAlign":"center","fontWeight":"bold","fontSize":"1.3em"},"eb_container__ca":{"fontStyle":"italic","fontWeight":"normal","color":"#999999"},"eb_container__ca_before":{"content":"\"(\""},"eb_container__ca_after":{"content":"\")\" !important"},"eb_container__cl":{"textAlign":"center","fontWeight":"bold"},"eb_container__cd":{"marginLeft":"1em","marginRight":"1em","fontStyle":"italic"},"eb_container_sup_class__v":{"color":"black","fontSize":".7em","letterSpacing":"-.03em","verticalAlign":"0.25em","lineHeight":"0","fontFamily":"\"Helvetica\", sans-serif","fontWeight":"bold","top":"inherit"},"eb_container_sup_class__v__after":{"content":"\"\\a0\""},"eb_container_sup___sup_before":{"content":"\"\\a0\""},"eb_container__va":{"fontStyle":"italic"},"eb_container__va_before":{"content":"\"(\""},"eb_container__va_after":{"content":"\")\" !important"},"eb_container__xo":{"fontWeight":"bold"},"eb_container__xk":{"fontStyle":"italic"},"eb_container__xq":{"fontStyle":"italic"},"eb_container__notelink":{"color":"#8c8c8c"},"eb_container__notelink_hover":{"color":"#8c8c8c"},"eb_container__notelink_active":{"color":"#8c8c8c"},"eb_container__notelink_visited":{"color":"#8c8c8c"},"eb_container__notelink_sup":{"fontSize":".7em","letterSpacing":"-.03em","verticalAlign":"0.25em","lineHeight":"0","fontFamily":"\"Helvetica\", sans-serif","fontWeight":"bold"},"eb_container__notelink___sup_before":{"content":"\"\\a0\""},"eb_container__f":{"display":"block"},"eb_container__fr":{"fontWeight":"bold"},"eb_container__fk":{"fontStyle":"italic","fontVariant":"small-caps"},"eb_container__class__fq":{"fontStyle":"italic"},"eb_container__fl":{"fontStyle":"italic","fontWeight":"bold"},"eb_container__fv":{"color":"#737373","fontSize":".75em","letterSpacing":"-.03em","verticalAlign":"0.25em","lineHeight":"0","fontFamily":"\"Helvetica\", sans-serif","fontWeight":"bold"},"eb_container__fv_after":{"content":"\"\\a0\""},"eb_container__h":{"textAlign":"center","fontStyle":"italic"},"eb_container__class__imt":{"textAlign":"center","fontWeight":"bold"},"eb_container__imt":{"fontSize":"1.4em"},"eb_container__imt1":{"fontSize":"1.4em"},"eb_container__imte":{"fontSize":"1.4em"},"eb_container__imte1":{"fontSize":"1.4em"},"eb_container__imt2":{"fontSize":"1.3em"},"eb_container__imte2":{"fontSize":"1.3em"},"eb_container__imt3":{"fontSize":"1.2em"},"eb_container__imte3":{"fontSize":"1.2em"},"eb_container__imt4":{"fontSize":"1.1em"},"eb_container__imte4":{"fontSize":"1.1em"},"eb_container__class__is":{"fontSize":"1.1em","textAlign":"center","fontWeight":"bold"},"eb_container__class___ip":{"textIndent":"1em"},"eb_container__ipi":{"paddingLeft":"rhythm(1)","paddingRight":"rhythm(1)"},"eb_container__im":{"textIndent":"0"},"eb_container__imi":{"textIndent":"0","marginLeft":"1em","marginRight":"1em"},"eb_container__ipq":{"fontStyle":"italic","marginLeft":"1em","marginRight":"1em"},"eb_container__imq":{"marginLeft":"1em","marginRight":"1em"},"eb_container__ipr":{"textAlign":"right","textIndent":"0"},"eb_container__class__iq":{"marginLeft":"1em","marginRight":"1em"},"eb_container__iq2":{"textIndent":"1em"},"eb_container__class__ili":{"paddingLeft":"1em","textIndent":"-1em"},"eb_container__ili1":{"marginLeft":"1em","marginRight":"1em"},"eb_container__ili2":{"marginLeft":"2em","marginRight":"1em"},"eb_container__iot":{"fontWeight":"bold","fontSize":"1.1em","marginTop":"1.5em"},"eb_container__io":{"marginLeft":"1em","marginRight":"0em"},"eb_container__io1":{"marginLeft":"1em","marginRight":"0em"},"eb_container__io2":{"marginLeft":"2em","marginRight":"0em"},"eb_container__io3":{"marginLeft":"3em","marginRight":"0em"},"eb_container__io4":{"marginLeft":"4em","marginRight":"0em"},"eb_container__ior":{"fontStyle":"italic"},"eb_container__iex":{"textIndent":"1em"},"eb_container__iqt":{"textIndent":"1em","fontStyle":"italic"},"eb_container__class__p":{"textIndent":"1em"},"eb_container__m":{"textIndent":"0 !important"},"eb_container__pmo":{"textIndent":"0","marginLeft":"1em","marginRight":"0em"},"eb_container__pm":{"marginLeft":"1em","marginRight":"0em"},"eb_container__pmr":{"textAlign":"right"},"eb_container__pmc":{"marginLeft":"1em","marginRight":"0em"},"eb_container__pi":{"marginLeft":"1em","marginRight":"0em"},"eb_container__pi1":{"marginLeft":"2em","marginRight":"0em"},"eb_container__pi2":{"marginLeft":"3em","marginRight":"0em"},"eb_container__pi3":{"marginLeft":"4em","marginRight":"0em"},"eb_container__mi":{"marginLeft":"1em","marginRight":"0em","textIndent":"0"},"eb_container__pc":{"textAlign":"center","textIndent":"0"},"eb_container__cls":{"textAlign":"right"},"eb_container__class__li":{"paddingLeft":"1em","textIndent":"-1em","marginLeft":"1em","marginRight":"0em"},"eb_container__li2":{"marginLeft":"2em","marginRight":"0em"},"eb_container__li3":{"marginLeft":"3em","marginRight":"0em"},"eb_container__li4":{"marginLeft":"4em","marginRight":"0em"},"eb_container__class__q":{"paddingLeft":"1em","textIndent":"-1em","marginLeft":"1em","marginRight":"0em"},"eb_container__q2":{"marginLeft":"1.5em","marginRight":"0em"},"eb_container__q3":{"marginLeft":"2em","marginRight":"0em"},"eb_container__q4":{"marginLeft":"2.5em","marginRight":"0em"},"eb_container__qr":{"textAlign":"right","fontStyle":"italic"},"eb_container__qc":{"textAlign":"center"},"eb_container__qs":{"fontStyle":"italic","textAlign":"right"},"eb_container__qa":{"textAlign":"center","fontStyle":"italic","fontSize":"1.1em","marginLeft":"0em","marginRight":"0em"},"eb_container__qac":{"marginLeft":"0em","marginRight":"0em","padding":"0","textIndent":"0","fontStyle":"italic"},"eb_container__qm2":{"marginLeft":"1.5em","marginRight":"0em"},"eb_container__qm3":{"marginLeft":"2em","marginRight":"0em"},"eb_container__bk":{"fontStyle":"italic"},"eb_container__nd":{"fontVariant":"small-caps"},"eb_container__add":{"fontWeight":"bold","fontStyle":"italic"},"eb_container__dc":{"fontStyle":"italic"},"eb_container__k":{"fontWeight":"bold","fontStyle":"italic"},"eb_container__lit":{"textAlign":"right","fontWeight":"bold"},"eb_container__pn":{"fontWeight":"bold","textDecoration":"underline"},"eb_container__sls":{"fontStyle":"italic"},"eb_container__tl":{"fontStyle":"italic"},"eb_container__wj":{"color":"#CC0000"},"eb_container__em":{"fontStyle":"italic"},"eb_container__bd":{"fontWeight":"bold"},"eb_container__it":{"fontStyle":"italic"},"eb_container__bdit":{"fontWeight":"bold","fontStyle":"italic"},"eb_container__no":{"fontWeight":"normal","fontStyle":"normal"},"eb_container__sc":{"fontVariant":"small-caps"},"eb_container__qt":{"fontStyle":"italic"},"eb_container__sig":{"fontWeight":"normal","fontStyle":"italic"},"eb_container__tr":{"display":"table-row"},"eb_container__class__th":{"fontStyle":"italic","display":"table-cell"},"eb_container__class__thr":{"textAlign":"right","paddingRight":"1.5em"},"eb_container__class__tc":{"display":"table-cell"},"eb_container__class__tcr":{"textAlign":"right","paddingRight":"1.5em"},"eb_container__class__mt":{"textAlign":"center","fontWeight":"bold","letterSpacing":"normal"},"eb_container__mt":{"fontSize":"2.8em"},"eb_container__mt1":{"fontSize":"2.8em"},"eb_container__mt2":{"fontSize":"1.6em","fontStyle":"italic","fontWeight":"normal"},"eb_container__class__ms":{"textAlign":"center","fontWeight":"bold","lineHeight":"1.2","letterSpacing":"normal"},"eb_container__ms":{"fontSize":"1.6em"},"eb_container__ms1":{"fontSize":"1.6em"},"eb_container__ms2":{"fontSize":"1.5em"},"eb_container__ms3":{"fontSize":"1.4em"},"eb_container__mr":{"fontSize":".9em","marginBottom":"1em","textAlign":"center","fontWeight":"normal","fontStyle":"italic"},"eb_container__s":{"textAlign":"center","fontWeight":"bold","fontSize":"1.1em","letterSpacing":"normal"},"eb_container__s1":{"textAlign":"center","fontWeight":"bold","fontSize":"1.1em","letterSpacing":"normal"},"eb_container__s2":{"textAlign":"center","fontWeight":"bold","fontSize":"inherit","letterSpacing":"normal"},"eb_container__s3":{"textAlign":"center","fontWeight":"bold","fontSize":"inherit","letterSpacing":"normal"},"eb_container__s4":{"textAlign":"center","fontWeight":"bold","fontSize":"inherit","letterSpacing":"normal"},"eb_container__sr":{"fontWeight":"normal","fontStyle":"italic","textAlign":"center","fontSize":"inherit","letterSpacing":"normal"},"eb_container__r":{"fontSize":".9em","fontWeight":"normal","fontStyle":"italic","textAlign":"center","letterSpacing":"normal"},"eb_container__rq":{"fontSize":".85em","lineHeight":"1.9","fontStyle":"italic","paddingLeft":"rhythm(0.5)","letterSpacing":"normal"},"eb_container__d":{"fontStyle":"italic","textAlign":"center","fontSize":"inherit","letterSpacing":"normal"},"eb_container__sp":{"textAlign":"left","fontWeight":"normal","fontStyle":"italic","fontSize":"inherit","letterSpacing":"normal"},"eb_container__class__p_____s":{"marginTop":"1.5em"},"eb_container__class__p_____s1":{"marginTop":"1.5em"},"eb_container__class__q_____s":{"marginTop":"1.5em"},"eb_container__class__q_____s1":{"marginTop":"1.5em"}}]


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
    useJwt('access-token')
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
    const [chapter, setChapter] = React.useState(route.params.chapter);
    const [bible, setBible] = React.useState(route.params.version);
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
                                    <RenderHTML allowedStyles={scriptureStyles} customHTMLElementModels={customHTMLElementModels} source={{ html: `<div class="scripture-styles"><dynamic-font>${data.content}</dynamic-font></div>` }} />
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
