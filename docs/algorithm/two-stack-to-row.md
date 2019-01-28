# 两个栈实现队列

```
var stack1 = new Stack();
var stack2 = new Stack();

function push(node){
    stack1.push(node);
}

function pop(){
    if(stack1.isEmpty() && stack2.isEmpty()){
        throw new Error("Queue is empty");
    }

    if(stack2.isEmpty()){
        while(!stack1.isEmpty()){
        stack2.push(stack1.pop());
    }
}

return stack2.pop();
}
```