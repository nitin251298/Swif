const Data=(state="", action)=>{
    switch(action.type){
        case 'Data':
            return action.payload
        default:
            return state
    }
}

export default Data;