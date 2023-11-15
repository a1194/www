function formatTime(t) {
    let bar = new Date()
  
    const year = String(bar.getFullYear()).padStart(2, '0')
    const month = String(bar.getMonth() + 1).padStart(2, '0')
    const day = String(bar.getDate()).padStart(2, '0')
    const time = bar.toLocaleTimeString()

    let newValue
    if(!t) {
        newValue = `${year}-${month}-${day}`
    } else if(t == 'md') {
        newValue = `${month}-${day}`
    } else if(t == 'd') {
        newValue = `${day}`
    } else if(t == 'y') {
        newValue = `${year}`
    }
    
    console.log(newValue);
    return newValue
}