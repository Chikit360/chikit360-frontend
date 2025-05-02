import { useEffect } from 'react'
import { AppDispatch, RootState } from '../../features/store'
import { useSelector, useDispatch } from 'react-redux'
import { allSubscriptionByHospitalId } from '../../features/subscription/subscriptionApiThunk'


const AllSubscription = () => {
  const dispatch = useDispatch<AppDispatch>()

  // Get user data from the auth state
  const { user } = useSelector((state: RootState) => state.auth)

  // Get subscriptions data from the state
  const { subscriptions } = useSelector((state: RootState) => state.subscription)

  // Fetch subscriptions by hospital ID when the component mounts
  useEffect(() => {
    console.log(user?.hospitalDetail)
    if (user?.hospitalDetail?._id) {
      dispatch(allSubscriptionByHospitalId(user?.hospitalDetail?._id))
    }
  }, [dispatch, user?.hospitalDetail?._id])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hospital Subscription List</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Plan</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Start Date</th>
              <th className="px-4 py-2 border">End Date</th>
              <th className="px-4 py-2 border">Razorpay Order ID</th>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions?.map((subscription) => (
              <tr key={subscription._id} className="text-center">
                <td className="px-4 py-2 border">{subscription.plan}</td>
                <td className="px-4 py-2 border">₹{subscription.price}</td>
                <td className="px-4 py-2 border">{subscription.startDate}</td>
                <td className="px-4 py-2 border">{subscription.endDate}</td>
                <td className="px-4 py-2 border">{subscription.razorpayOrderId || "-"}</td>
                <td className="px-4 py-2 border">{subscription.transactionId || "-"}</td>
                <td className="px-4 py-2 border">
                 {subscription.isActive ? "Yes":"No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllSubscription
