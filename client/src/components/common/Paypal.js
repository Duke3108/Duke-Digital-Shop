
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { apiCreateOrder } from "apis/product";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// This value is from the props in the UI
const style = { "layout": "vertical" };

// function createOrder() {
//     // replace this url with your server
//     return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/create-order", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         // use the "body" param to optionally pass additional order information
//         // like product ids and quantities
//         body: JSON.stringify({
//             cart: [
//                 {
//                     sku: "1blwyeo8",
//                     quantity: 2,
//                 },
//             ],
//         }),
//     })
//         .then((response) => response.json())
//         .then((order) => {
//             // Your code here after create the order
//             return order.id;
//         });
// }

// function onApprove(data) {
//     // replace this url with your server
//     return fetch("https://react-paypal-js-storybook.fly.dev/api/paypal/capture-order", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             orderID: data.orderID,
//         }),
//     })
//         .then((response) => response.json())
//         .then((orderData) => {
//             // Your code here after capture the order
//         });
// }

// Custom component to wrap the PayPalButtons and show loading spinner

const ButtonWrapper = ({ currency, showSpinner, amount, payload, setIsSuccess }) => {
    const [{ isPending, options }, dispatch] = usePayPalScriptReducer();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, showSpinner])

    const handleSaveOrder = async () => {
        const response = await apiCreateOrder({ ...payload, status: 'Succeed' })
        if (response.success) {
            setIsSuccess(true)
            setTimeout(() => {
                Swal.fire({
                    title: 'Thanh toán thành công',
                    text: 'Cảm ơn bạn đã mua hàng tại Duke Shop',
                    icon: 'success',
                    confirmButtonText: 'Đóng'
                }).then(() => {
                    navigate('/')
                })
            }, 2000)
        }
    }
    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                style={style}
                disabled={false}
                forceReRender={[style, currency, amount]}
                fundingSource={undefined}
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [{
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                    }],
                }).then(orderId => orderId)}
                onApprove={(data, actions) => actions.order.capture().then(async (response) => {
                    handleSaveOrder()
                })}
            />
        </>
    );
}

export default function Paypal({ amount, payload, setIsSuccess }) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px", margin: "auto" }}>
            <PayPalScriptProvider options={{ clientId: "test", components: "buttons", currency: "USD" }}>
                <ButtonWrapper setIsSuccess={setIsSuccess} payload={payload} currency={'USD'} showSpinner={false} amount={amount} />
            </PayPalScriptProvider>
        </div>
    );
}