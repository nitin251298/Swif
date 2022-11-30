const usernames=(state="", action)=>{
    switch(action.type){
        case 'usernames':
            return action.payload
        default:
            return state
    }
}

export default usernames;