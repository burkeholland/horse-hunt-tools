// let loopers = [{
//     id: 0,
//     next_id: 1,
//     items: [1, 2, 3, 4, 5]
//   },
//   {
//     id: 1,
//     next_id: 2,
//     items: [6, 7, 8, 9, 10]
//   },
//   {
//     id: 2,
//     items: [11, 12, 13, 14, 15]
//   },
//   {
//     id: 3,
//     items: [16, 17, 18, 19, 20]
//   }
// ];

// function find(id) {

//   let result = loopers.filter(item => {
//     return item.id === id;
//   });

//   return (result[0]);
// }

// function recurse(id, aggregator) {
//   aggregator = aggregator || [];

//   let result = find(id);

//   aggregator = aggregator.concat(result.items);

//   if (result.next_id == null) {
//     return aggregator;
//   }

//   return recurse(result.next_id, aggregator);
// }

// function main() {
//   let result = recurse(0);
//   console.log(JSON.stringify(result));
// }

// function* generator(id) {
//   let item = find(id);

//   yield item;

//   if (item.next_id) {
//     yield* generator(item.next_id);
//   }
// }

// let f = [];
// let g = generator(0);
// let r = g.next();

// while (!r.done) {
//   f = f.concat(r.value.items);
//   r = g.next();
// }

// console.log(JSON.stringify(f));

let a = [{
    name: 'burke'
  },
  {
    name: 'jasmine'
  },
  {
    name: 'burke'
  }
]

let b = a.filter((item, pos, self) => {
  return self.indexOf(item.name) == pos;
});

console.log(b);