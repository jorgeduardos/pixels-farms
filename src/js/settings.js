export default function settingsEvents(input){

    let settingName = input.name;
    console.log(settingName)

    switch (settingName) {
        case 'open-iframe':
            openIframeSetting(settingName, input)
            break;
    
        default:
            break;
    }
}

function openIframeSetting(setting, el){
    let currentState = localStorage.getItem(setting) == 'true' ? true : false;;
    // console.log( `chaging ${setting}`, !currentState)
    localStorage.setItem(setting, !currentState);
}