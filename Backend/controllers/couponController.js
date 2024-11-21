import Coupon from "../model/couponSchema.js";


const Add = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      userLimit,
      validFrom,
      validTill,
      active,
    } = req.body;

    // Validate required fields
    if (!code || !discountType || !discountValue || !validFrom || !validTill) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Check if validFrom is before validTill
    if (new Date(validFrom) >= new Date(validTill)) {
      return res.status(400).json({ message: "Invalid date range: 'validFrom' must be earlier than 'validTill'." });
    }

    // Validate discountValue is non-negative
    if (discountValue < 0) {
      return res.status(400).json({ message: "Discount value must be a non-negative number." });
    }

    // Check for duplicate coupon code
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(409).json({ message: "Coupon code already exists." });
    }

    // Create new coupon
    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || null,
      usageLimit: usageLimit || null,
      userLimit: userLimit || null,
      validFrom,
      validTill,
      active: active !== undefined ? active : true, // Default to true if not provided
    });

    // Save coupon to the database
    await newCoupon.save();

    res.status(201).json({
      message: "Coupon created successfully.",
      data: newCoupon,
    });
  } catch (error) {
    console.error("Error adding coupon:", error.message);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
const fetchCoupons = async (req, res) => {
    try {
      // Retrieve all coupons from the database
      //console.log("Fetching coupons");
      const coupons = await Coupon.find({}).sort({ validFrom: -1 }); // Sort by most recent first
  
      if (!coupons || coupons.length === 0) {
        return res.status(404).json({
          message: "No coupons found.",
          data: [],
        });
      }
  
      res.status(200).json({
        message: "Coupons fetched successfully.",
        data: coupons,
      });
    } catch (error) {
      console.error("Error fetching coupons:", error.message);
      res.status(500).json({
        message: "Internal server error.",
        error: error.message,
      });
    }
  };
  
  const Apply = async (req, res) => {
    try {
      const { promoCode } = req.body; // Extract promo code from request body
  
      // Find a coupon with the given promo code
      const code = await Coupon.findOne({ code: promoCode });
  
      if (code) {
        return res.json({
          success: true,
          code,
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid Promo Code",
        });
      }
    } catch (err) {
      // Log the error and send a generic error response
      console.error("Error applying promo code:", err);
      res.status(500).json({
        success: false,
        message: "An error occurred while applying the promo code.",
      });
    }
  };
  

export { Add,fetchCoupons,Apply};
