const Db=(state="", action)=>{
    switch(action.type){
        case 'Db':
            return action.payload
        default:
            return state
    }
}

export default Db;