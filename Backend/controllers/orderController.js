import orderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);

// Place Order
const placeOrder = async (req, res) => {
    const frontend_url="http://localhost:5173"
    try {
        // Create a new order document in the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            instruction:req.body.instruction,
        });
        await newOrder.save();

        // Update user cart data (this part should be based on your app's data model)
        await userModel.findByIdAndUpdate(req.body.userId, { cartData:{} }); // Adjust as necessary

        // Map the items to the format required by Stripe for line_items
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,  // Amount in paise for INR (multiply by 100)
            },
            quantity: item.quantity,
        }));

        // Add delivery charge as an additional item in the line_items array
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2*100, // Delivery charge in paise (e.g., 2*80)
            },
            quantity: 1,
        });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            customer_email: req.body.email,  // Optional: capture customer email
        });

        // Respond with the session URL to redirect the user to Stripe Checkout
        res.json({ success:true,session_url:session.url});
    } catch (error) {
        console.error("Error placing order:", error);
        res.json({ success:false,message: "An error occurred while placing the order." });
    }
};
   const verifyOrder =async(req,res)=>{
   const{orderId,success}=req.body;
   try{
    
     if(success==="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Paid"});
     }
     else{
        await orderModel.findByIdAndUpdate(orderId);
        res.json({success:false,message:"Not Paid"});
     }

   }catch(err){
    console.log(err);
    res.json({success:false,message:"Error"});
   }

   }

// user orders for frontend
const userOrders=async(req,res)=>{
  try{
     const orders=await orderModel.find({userId:req.body.userId});
     res.json({success:true,data:orders});
  } catch(err){
      console.log(err);
      res.json({success:false,message:"Error"});
  }
}
// listing orders for admin panel
const listOrders=async(req, res)=>{
    try{
          const orders = await orderModel.find({});
          res.json({success:true,data:orders});
    } catch(err){
       console.log(err);
       res.json({success:false,message:"Error"});
    }
}

// api for updating order status
const updateStatus=async(req,res)=>{
 try{
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({sucess:true,message:"status updated"});
 }catch(err){
    console.log(err);
    res.json({sucess:false,message:"Error updating order"});
 }
}

export { placeOrder,userOrders,listOrders,updateStatus,verifyOrder};
