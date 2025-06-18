export function UpdateComponent(list, item, callback) {
    console.log(item);
    console.log(callback);
    
    
    item.onUpdate(() => {
        list.add(callback(item.value[item.value.length - 1]))
    });
    return list
}