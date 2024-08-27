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
const q = query(collection(db, "items"), where("type", "==", "stationary"));

function additemcard(itemname,itemstock,imgname,itemcost){
    $( "#itemlog" ).append( `<div class="col-xl-3 col-lg-4 col-md-5 col-11">
            <div class="itemcard card bg-white m-3" style="height:40vh;max-height:300px">
                <img src="items/stationary/${imgname}" height="30%" style="object-fit: contain;" class="card-img-top" alt="...">
                <div class="px-4 border-top" style="height:70%">
                    <div class="fs-4 itemname">${itemname}</div>
                    <span style="width:30%" class="fs-5 itemcost d-inline-block">$${itemcost}</span>
                    <span style="width:65%" class="badge-contain d-inline-block text-center"><div class="badge bg-success fs-5">In Stock: <span class="currstock">${itemstock}</span></div></span>
                    <div style="width:75%" class="input-contain my-1"><div class="input-group">
                        <button class="btn btn-primary px-2 button-addon1" type="button"><i class="bi bi-caret-left-fill"></i></button>
                        <input min="1" class="form-control fs-5 text-center py-0 bg-white quantity" placeholder="0" aria-label="Username" aria-describedby="basic-addon" disabled>
                        <button class="btn btn-primary px-2 button-addon2" type="button"><i class="bi bi-caret-right-fill"></i></button>
                    </div></div>
                    <div class="my-1"><button href="#" class="btn btn-primary itemadd-trigger" height="15%">Add to Cart</button></div>
                    <div class="d-none msg-label"></div>
                </div>
            </div>
          </div>` )
}
function addcartitem(item_name,cost,quantity,img){
    $("#cartlist").append(`<li class="list-group-item d-flex align-items-top">
          <img class="mx-1" src="items/stationary/${img}" style="object-fit: contain;width:20%;height:10vh">
          <span class="d-inline-block ps-2" style="width:75%;height:100%;">
            <div class="fs-4 d-inline-block" style="height:40%;width:55%;white-space: nowrap;">${item_name}</div>
            <div class="fs-5 d-inline-block text-end" style="height:30%;width:40%;white-space: nowrap;">Cost: $${cost*quantity}</div>
            <div class="fs-4 d-inline-block" style="height:50%;width:100%;">
              <button class="btn btn-primary d-inline-flex align-items-center justify-content-center rounded-circle text-white cart-minus fs-5" style="max-height:7vh;aspect-ratio: 1 / 1;"><i class="bi bi-dash"></i></button>
              <input min="1" class="d-inline form-control fs-5 text-center mx-2 bg-white quantity" style="width:25%;" placeholder="0" aria-label="Username" aria-describedby="basic-addon" disabled>
              <button class="btn btn-primary d-inline-flex align-items-center justify-content-center rounded-circle text-white cart-plus fs-5" style="max-height:7vh;aspect-ratio: 1 / 1;"><i class="bi bi-plus"></i></button>
              <button class="btn btn-danger d-inline-flex align-items-center justify-content-center rounded-circle text-white cart-del fs-5 ms-1" style="max-height:7vh;aspect-ratio: 1 / 1;"><i class="bi bi-trash3"></i></button>
            </div>
          </span>
        </li>`)
    $(".total_cost").text(Number($(".total_cost").text())+cost*quantity)
    $("#cartlist").children().eq(-1).children().eq(1).children().eq(-1).children(".quantity").val(quantity)
    var prev_quantity=quantity
    $("#cartlist").children().eq(-1).children().eq(1).children().eq(-1).children(".cart-minus").on("click",
        async function(){
            var quantity_input=$(this).siblings(".quantity")
            if(quantity_input.val()>1){
                quantity_input.val(Number(quantity_input.val())-1)
            }else{
                quantity_input.val(1)
            }
            var cartdata=JSON.parse(localStorage.getItem("cart"))
            cartdata[item_name]=Number(quantity_input.val())
            localStorage.setItem("cart", JSON.stringify(cartdata))
            $(this).parent().parent().children().eq(1).text(`Cost: $${cost*quantity_input.val()}`)
            $(".total_cost").text(Number($(".total_cost").text())-cost*prev_quantity+cost*quantity_input.val())
            prev_quantity=quantity_input.val()
        }
    )
    
    $("#cartlist").children().eq(-1).children().eq(1).children().eq(-1).children(".cart-plus").on("click",
        async function(){
            var quantity_input=$(this).siblings(".quantity")
            if(quantity_input.val()<0){
                quantity_input.val(0)
            }else{
                var docRef = doc(db, "items", $(this).parent().parent().children().eq(0).text());
                var docSnap = await getDoc(docRef);
                if(quantity_input.val()<docSnap.data()['curr_stock']){
                    console.log(quantity_input.val())
                    quantity_input.val(Number(quantity_input.val())+1)
                    console.log(quantity_input.val())
                }else{
                    quantity_input.val(docSnap.data()['curr_stock'])
                }
                
            }
            var cartdata=JSON.parse(localStorage.getItem("cart"))
            cartdata[item_name]=Number(quantity_input.val())
            localStorage.setItem("cart", JSON.stringify(cartdata))
            $(this).parent().parent().children().eq(1).text(`Cost: $${cost*quantity_input.val()}`)
            $(".total_cost").text(Number($(".total_cost").text())-cost*prev_quantity+cost*quantity_input.val())
            prev_quantity=quantity_input.val()
        }
    )
    $("#cartlist").children().eq(-1).children().eq(1).children().eq(-1).children(".cart-del").on("click",
        async function(){
            $("#removecartitem-modal").modal("show")
            $("#removecartitem-modal").children().children().children().eq(1).children().text(`Item "${item_name}" will be removed from cart`)
            var elementbackup=$(this)
            var quantity_input=$(this).siblings(".quantity")
            $(".removecartitem-confirm").click(function(){
                console.log($(".total_cost").text(),cost,quantity_input)
                $(".total_cost").text(Number($(".total_cost").text())-cost*quantity_input.val())
                var cartdata=JSON.parse(localStorage.getItem("cart"))                                                                    
                $("#removecartitem-modal").modal("hide")
                delete cartdata[item_name];
                localStorage.setItem("cart", JSON.stringify(cartdata))
                elementbackup.parent().parent().parent().remove()
            })
        }
    )
}
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  additemcard(doc.id,doc.data()["curr_stock"],doc.data()["img"],doc.data()["cost"])
  console.log(doc.id, " => ", doc.data());
});

//local storage
if(localStorage.getItem("cart")==null){
    localStorage.setItem("cart", "{}")
}else{
    var cartdata=JSON.parse(localStorage.getItem("cart"))
    Object.entries(cartdata).forEach(async function([key, value]){
        var docRef = doc(db, "items", key);
        var docSnap = await getDoc(docRef);
        console.log(`${key}: ${value}`);
        addcartitem(key,docSnap.data()["cost"],value,docSnap.data()["img"])
            
    });
}


$(".button-addon1").click(
    function(){
        var quantity_input=$(this).siblings(".quantity")
        if(quantity_input.val()>0){
            quantity_input.val(Number(quantity_input.val())-1)
        }else{
            quantity_input.val(0)
        }
    }
)
$(".button-addon2").click(
    function(){
        var quantity_input=$(this).siblings(".quantity")
        if(quantity_input.val()<0){
            quantity_input.val(0)
        }else{
            if(quantity_input.val()<$(this).parent().parent().parent().children(".badge-contain").children().children().text()){
                quantity_input.val(Number(quantity_input.val())+1)
            }else{
                quantity_input.val($(this).parent().parent().parent().children(".badge-contain").children().children().text())
            }
            
        }
    }
)

$(".itemadd-trigger").click(
    async function(){
        var cartdata=JSON.parse(localStorage.getItem("cart"))
        var input_value=$(this).parent().parent().children(".input-contain").children().children("input").val()
        var item_name=$(this).parent().parent().children(".itemname").text()
        var msg_label=$(this).parent().parent().children(".msg-label")
        if(input_value>0){
            var last_update_stock=$(this).siblings(".quantity").val()
            var docRef = doc(db, "items", item_name);
            var docSnap = await getDoc(docRef);
            console.log(docSnap.data()["curr_stock"])
            if(docSnap.data()["curr_stock"]!=last_update_stock){
                $(this).siblings(".quantity").val(docSnap.data()["curr_stock"])
                last_update_stock=docSnap.data()["curr_stock"]
                $(this).parent().parent().children(".badge-contain").children().children().text(last_update_stock)
            }
            if(input_value>last_update_stock){
                msg_label.addClass("text-danger").removeClass("text-success").removeClass("d-none").text("Error - Invalid Quanitiy")
            }else{
                if(cartdata[item_name]!=undefined){
                    console.log("hi")
                    $("#itemoverwrite-modal").modal("show")
                    msg_label.addClass("d-none")
                    var elementbackup=$(this)
                    $(".additem-confirm").click(function(){
                        $("#itemoverwrite-modal").modal("hide")
                        msg_label.addClass("text-success").removeClass("text-danger").removeClass("d-none").text("Added to Cart")
                        cartdata[item_name]=Number(input_value)
                        localStorage.setItem("cart", JSON.stringify(cartdata))
                        $("#cartlist").children().each(function(idx, ele){
                            console.log(idx,ele)
                            if($(ele).children().eq(1).children().eq(0).text()==item_name){
                                $(ele).children().eq(1).children().eq(2).children().eq(1).val(Number(input_value))
                                $(ele).children().eq(1).children().eq(1).text(`Cost: $${Number(input_value)*docSnap.data()["cost"]}`)
                                return
                            }
                        })
                    })
                }else{
                    msg_label.addClass("text-success").removeClass("text-danger").removeClass("d-none").text("Added to Cart")
                    cartdata[item_name]=Number(input_value)
                    localStorage.setItem("cart", JSON.stringify(cartdata))
                    addcartitem(item_name,docSnap.data()["cost"],Number(input_value),docSnap.data()["img"])
                }
            }    
        }
    }
)

$(".itempage-trigger").click(function(){
    $("#itemlog").removeClass("d-none")
    $("#cartlog").addClass("d-none")
})

$(".cartpage-trigger").click(function(){
    $("#itemlog").addClass("d-none")
    $("#cartlog").removeClass("d-none")
})

$("#order_trigger").click(async function(){
    var inputdata=$(".order_form")
    var id_input=$(".order_form").children().eq(1).children().eq(0).val().trim()
    var class_input=$(".order_form").children().eq(3).children().eq(0).children().eq(0).val().trim()
    var class_no_input=$(".order_form").children().eq(3).children().eq(1).children().eq(0).val().trim()
    if(id_input!="" &&
     $(".order_form").children().eq(2).children().eq(0).val().trim()!="" &&
     class_input!="" &&
     class_no_input!=""){
        if(id_input[0]=="s" && !isNaN(id_input.slice(1,-1)) && id_input.length==7){
            if(Number(class_input[0])>=1 && Number(class_input[0])<=6 && ["T","W","M","P","J"].includes(class_input[1]) && class_input.length==2){
                if(Number(class_no_input)>0 && Number(class_no_input)<40){
                    $(".order-msg").text("")
                    $("#order-process-modal").modal("show")
                    var sufficient_stock=true
                    var insufficient_list=[]
                    $("#cartlist").children().each(async function(idx, ele){
                        var itemname=$(ele).children().eq(1).children().eq(0).text()
                        var input_quantity=$(ele).children().eq(1).children().eq(2).children(".quantity").val()
                        var docRef = doc(db, "items", itemname);
                        var docSnap = await getDoc(docRef);
                        if(docSnap.data()["curr_stock"]<input_quantity){
                            sufficient_stock=false
                            insufficient_list.push(itemname)
                        }
                    })
                    if(sufficient_stock){
                        var vardoc = doc(db, "stationary_orders", "variables");
                        var varSnap = await getDoc(vardoc);
                        var order_id=varSnap.data()["next_orderid"]
                        var cartdata=JSON.parse(localStorage.getItem("cart"))
                        var order_data = {
                            class: class_input,
                            class_no: Number(class_no_input),
                            student_name: $(".order_form").children().eq(2).children().eq(0).val(),
                            student_id: id_input,
                            total_cost: Number($(".total_cost").text()),
                            order_date: Timestamp.fromDate(new Date()),
                            order_content: cartdata
                        }
                        await setDoc(doc(db, "stationary_orders", `order_${order_id}`), order_data);
                        await updateDoc(vardoc, {
                            next_orderid: order_id+1
                          });
                        Object.entries(cartdata).forEach(async function([key, value]){
                            var cart_item_doc = doc(db, "items", key);
                            var cart_item_snap = await getDoc(cart_item_doc);
                            var prev_curr_stock=cart_item_snap.data()["curr_stock"]
                            await updateDoc(cart_item_doc, {
                                curr_stock: prev_curr_stock-value
                              }); 
                        });
                        localStorage.setItem("cart", "{}")
                        $("#cartlist").html("")
                        $("#order-process-modal").children().children().children(".modal-body").children().text("Order Successful")
                        $("#order-process-modal").children().children().children(".modal-footer").html(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>`)

                    }else{
                        $("#order-process-modal").children().children().children(".modal-header").html(`<h1 class="modal-title fs-5" id="staticBackdropLabel">Insufficient stock, order failed!</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`)
                        $("#order-process-modal").children().children().children(".modal-body").children().text(`The following items are insufficient: ${insufficient_list}`)
                        $("#order-process-modal").children().children().children(".modal-footer").html(`<button type="button" class="btn btn-danger" data-bs-dismiss="modal">Ok</button>`)
                    }

                }else{
                    $(".order-msg").text("Invalid class no. input")
                }
            }else{
                $(".order-msg").text("Invalid class input")
            }
        }else{
            $(".order-msg").text("Invalid student ID")
        }
     }else{
        $(".order-msg").text("Please fill in all fields")
     }
})
