import React from 'react'
import { View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'


const VersionSelectMenu = () => {
    const onOpen = React.useCallback(() => {
        setOpen(!open);
    })


    const [open, setOpen] = React.useState(false);
    const [haveVersion, setHaveVersion] = React.useState();
    const [bible, setBible] = React.useState('de4e12af7f28f599-02'); //although it could change depending on the version, but I am passing back to bible screen for more bible
    const [loading, setLoading] = React.useState(false);
    const [version, setVersion] = React.useState([
        // Have to be label and value... cannot be anything else...
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
    return (
        // flex if only not 1, but idk. I may be able to pull off without flexing.
        <View >
            <DropDownPicker
            // black dropdown on black screen. White dropdown on white screen
                style={{ width: 200, height: 40 }}
                placeholder='Select a Version'
                open={open}
                value={haveVersion}
                items={version}
                setOpen={() => onOpen()}
                // i guess it will be undefined on the first iteration
                setValue={(val) => {setBible(val); setLoading(true);}}
            // setItems={setVersion}
            />
        </View>

    )
}

export default VersionSelectMenu