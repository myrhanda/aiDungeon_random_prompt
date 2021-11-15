
// Checkout the repo examples to get an idea of other ways you can use scripting 
// https://github.com/latitudegames/Scripting/blob/master/examples

const WORLD_INFO_KEY_REGEX_PREFIX = '(?:^\\s*|,\\s*)(?<key>'
const WORLD_INFO_KEY_REGEX_SUFFIX = ')(?:_(?<digits>\\d+))?(?:\\s*,|\\s*$)'

const PROMPT_KEY = 'myrha_prompt'

const getWorldInfoKeyRegex = (key) => {
  return RegExp(WORLD_INFO_KEY_REGEX_PREFIX + key + WORLD_INFO_KEY_REGEX_SUFFIX, 'i')
}

const getWorldInfoEntriesByKey = (key) => {
  const regex = getWorldInfoKeyRegex(key)
  return worldEntries?.filter(entry => entry.keys.match(regex))
}

const getRandomPrompt = () => {
  const regex = getWorldInfoKeyRegex(PROMPT_KEY)
  const promptInfoList = worldInfo?.filter(entry => entry.type.match(regex))
  const index = Math.floor((Math.random() * promptInfoList.length));
  let result = ""
  if (index < promptInfoList.length){
    const promptInfo = promptInfoList[index];
    result=promptInfo.entry
    if(result == undefined){
      result = ""
    }
    else{
      result = "\n"+result
    }
  }
  return result
}

const modifier = (text) => {
  let modifiedText = text
  if(!state.myrha_prompt_initialised){
    state.myrha_prompt_initialised=true;
    modifiedText+= getRandomPrompt()
  }
  
  // You must return an object with the text property defined.
  return { text: modifiedText }
}

// Don't modify this part
modifier(text)
