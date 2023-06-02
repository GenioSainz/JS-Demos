
var styleText = 'color:green;font-size: 14px; font-wight:bold';
var styleBar  = 'color:green;font-size: 14px; font-wight:bold';
console.log('%c TENSORS' ,styleText );
console.log('%c ////////////////////////////////////////////////////////////////',styleBar);

tf.tensor([1, 2, 3, 4]).print();
tf.tensor([[1, 2], [3, 4]]).print();
tf.tensor([1, 2, 3, 4], [2, 2]).print();

console.log('%c COMPLEX TENSORS' ,styleText );
console.log('%c ////////////////////////////////////////////////////////////////',styleBar);

tf.complex(1,2).print();
tf.complex( tf.linspace(1, 5, 5), tf.linspace(6,10,5) ).print();
const real = tf.tensor([[1, 2], [3, 4]]);
const imag = tf.tensor([[5, 6], [7, 8]]);
            tf.complex(real, imag).print();

console.log('%c LINSPACES AND RANGES TENSORS' ,styleText );
console.log('%c ////////////////////////////////////////////////////////////////',styleBar);

let v = tf.linspace(0, 9, 10).pow(2).round().print();
tf.range(0, 9, 2).print();
tf.range(0, 9, 2).print();

console.log('%c RANDOM TENSORS' ,styleText );
console.log('%c ////////////////////////////////////////////////////////////////',styleBar);

tf.randomUniform([2, 2]).print();
tf.randomUniform([3, 3],20,30).print();
tf.randomUniformInt([3, 3], 5, 10).print();

console.log('%c ONES , ZEROS',styleText);
console.log('%c ////////////////////////////////////////////////////////////////',styleBar);

tf.ones([2, 2]).print();

const rows1 = Math.round(Math.random()*3+1);
const cols1 = Math.round(Math.random()*3+1);
tf.onesLike( tf.randomUniform([rows1, cols1]) ).print();

tf.zeros([2, 2]).print();

const rows0 = Math.round(Math.random()*3+1);
const cols0 = Math.round(Math.random()*3+1);
tf.zerosLike( tf.randomUniform([rows0, cols0]) ).print();


const x = tf.tensor1d([1, 2, 3, 4]);
x.reshape([4,1]).print();

const a = tf.tensor2d([[1, 2], [10, 20]]);
const b = tf.tensor2d([[3, 4], [30, 40]]);


var t = tf.linspace(1,10,10);

var tt =t.add(2).div(5).print()

