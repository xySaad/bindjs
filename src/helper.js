export function UpdateComponent(list, item, callback) {
    item.onUpdate(() => {
        list.add(callback(item.value[item.value.length - 1]))
    });
    return list
}