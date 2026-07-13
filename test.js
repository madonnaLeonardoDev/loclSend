let map = new Map()
map.set('1', {'abc': '123'})

if(!map.get('2').abc){
    console.log(false)
}