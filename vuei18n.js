
// const app = Vue.createApp({
//         data() {
//           return {
//             eee: "hello"
//           }
//         }
//       })


// const i18n = Vue.createI18n({
//     locale: 'ja',
//     fallbackLocale: 'en',
//     messages: {
//       en: {
//         message: {
//           hello: 'hello world'
//         }
//       },
//       ja: {
//         message: {
//           hello: 'こんにちは、世界'
//         }
//       }
//     }
//   })
// app.use(i18n)
// app.mount('#app')
const i18n = VueI18n.createI18n({
    locale: 'English',
    messages: {
      English: {
        message: {
          hello: 'hello world',
        },
      },
      繁體中文: {
        message: {
          hello: 'こんにちは、世界',
        },
      },
    },
  });
  
const app = Vue.createApp({
    data(){
        return{
        }
    },
    methods: {
        ChangeLang(){
        }
    }
}).use(i18n).mount('#app');