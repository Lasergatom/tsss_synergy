// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjRn1O7pm3n3CpCH3ZGkQLltQsL8recpw",
  authDomain: "synergy-borrow.firebaseapp.com",
  projectId: "synergy-borrow",
  storageBucket: "synergy-borrow.appspot.com",
  messagingSenderId: "209109078421",
  appId: "1:209109078421:web:8630cee8cd92f78075269c",
  measurementId: "G-7NKYPFD8KR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function addorderecord(order_tag, orderdata){
    $("#stationary_orderlist").append(
        `<li class="list-group-item" id="${order_tag}">
            <div class="fs-6 d-inline-block" style="width:30%">Order Tag: ${order_tag}</div>
            <div class="fs-6 d-inline-block" style="width:30%">Total Cost: $${orderdata["total_cost"]}</div>
            <br>
            <div class=" d-inline-block" style="width:30%">Student ID: ${orderdata["student_id"]}</div>
            <div class="fs-6 d-inline-block" style="width:30%">Name: ${orderdata["student_name"]}</div>
            <div class="fs-6 d-inline-block" style="width:15%">Class: ${orderdata["class"]}</div>
            <div class="fs-6 d-inline-block" style="width:15%">Class No: ${orderdata["class_no"]}</div>
            <br>
            <div class="fs-6 d-inline-block order_content" style="width:100%">
                <span class="mx-2">Order Content</span>
            </div>
        </li>`
    )
    Object.entries(orderdata["order_content"]).forEach(async function([key, value],idx){
        $(`#${order_tag}`).children(".order_content").append(`<span class="mx-2">${idx+1}. ${key} - ${value}</span>`)
    });
}

const q = query(collection(db, "stationary_orders"))

const querySnapshot = await getDocs(q);
var doclist=[]
querySnapshot.forEach((doc) => {
    if(doc.id!="variables"){
        doclist.push([doc.id,doc.data()])
    }
});
doclist.reverse().map(function(val,idx){
    addorderecord(val[0],val[1])
})