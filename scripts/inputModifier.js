
// Checkout the repo examples to get an idea of other ways you can use scripting 
// https://github.com/latitudegames/Scripting/blob/master/examples

const WORLD_INFO_KEY_REGEX_PREFIX = '(?:^\\s*|,\\s*)(?<key>'
const WORLD_INFO_KEY_REGEX_SUFFIX = ')(?:_(?<digits>\\d+))?(?:\\s*,|\\s*$)'

const PROMPT_KEY = 'myrha_prompt'
const DRESS_KEY = 'myrha_dress'

const CONTEXT_KEY=[]

const getWorldInfoKeyRegex = (key) => {
  return RegExp(WORLD_INFO_KEY_REGEX_PREFIX + key + WORLD_INFO_KEY_REGEX_SUFFIX, 'i')
}

const getWorldInfoEntriesByKey = (key) => {
  const regex = getWorldInfoKeyRegex(key)
  return worldEntries?.filter(entry => entry.keys.match(regex))
}


const getRandomPromptInfo = () => {
  let regex = getWorldInfoKeyRegex(PROMPT_KEY)
  let promptInfoList = worldInfo?.filter(entry => entry.type.match(regex))  
	for (const context of CONTEXT_KEY) {
		regex = getWorldInfoKeyRegex(context)
		promptInfoList = promptInfoList?.filter(entry => entry.type.match(regex))  
	}
  const index = Math.floor((Math.random() * promptInfoList.length));
  let result = ""
  if (index < promptInfoList.length){
    result = promptInfoList[index];
  }
  return result
}

const composeFinalPrompt=(promptText, promptWear)=>{
	if(promptText.includes(DRESS_KEY)){
		return promptText.replace(DRESS_KEY,promptWear)
	}
	else{
		if(promptText && promptWear){
			return promptWear+"\n"+promptText
		}
		else{
			return promptWear+""+promptText
		}
	}
}

const getRandomPrompt = () => {
	//extraire le worldInfo
	const promptInfo = getRandomPromptInfo()
	let promptText = ""
	let promptWear = ""
	let wearInfo = null
	if(promptInfo != undefined){
		//prompt
		if(promptInfo.entry != undefined){
			promptText = promptInfo.entry
		}
		//wear pour ce prompt
		const attributes=promptInfo.attributes
		if(attributes){
			let dress 
			if(attributes.myrha_dress){
			  dress=attributes.myrha_dress
			}
			if(dress){
				promptWear = getRandomDress(dress)
				wearInfo = getRandomDressInfo(dress)
			}
		}
	}
	applyToMemory(promptInfo,wearInfo)
	return composeFinalPrompt(promptText, promptWear)
}

const applyToMemory=(promptInfo,wearInfo)=>{
	
}

const getRandomDress=(key) =>{
	const dressInfo = getRandomDressInfo(key)
	let result=""
	if(dressInfo){
	  result=dressInfo.entry
	}
	return result
}

const getRandomDressInfo=(key) =>{
	const dressRegex = getWorldInfoKeyRegex(DRESS_KEY)
	const specificRegex = getWorldInfoKeyRegex(key)
	const promptInfoList = worldInfo?.filter(entry => entry.type.match(dressRegex))?.filter(entry => entry.type.match(specificRegex))
	const index = Math.floor((Math.random() * promptInfoList.length));
	let result = null
	if (index < promptInfoList.length){
		result = promptInfoList[index];
	}
	return result
}

const clearPrompts=()=>{
	let len = worldInfo.length
	const regex = getWorldInfoKeyRegex(PROMPT_KEY)
	for (let i = 0; i < len; i++) {
		if(worldInfo[i]?.type?.match(regex)){
			removeWorldEntry(i)
		}
	}
}

const modifier = (text) => {
  let modifiedText = text
  if(!state.myrha_prompt_initialised){
    state.myrha_prompt_initialised=true;
    modifiedText+= '\n'+getRandomPrompt()
	clearPrompts()
  }
  
  // You must return an object with the text property defined.
  return { text: modifiedText }
}

// Don't modify this part
modifier(text)
