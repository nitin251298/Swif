const Id=(state="", action)=>{
    switch(action.type){
        case 'Id':
            return action.payload
        default:
            return state
    }
}

export default Id;