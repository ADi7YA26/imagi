import Header from "@/components/shared/Header"
import { useNavigate, useParams } from "react-router-dom"
import { transformationTypes } from "@/constants"
import TransformationForm from "@/components/shared/TransformationForm"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"
import { useEffect, useState } from "react"

async function fetchUserData(userId) {
  try {
    const baseURL = import.meta.env.VITE_BACKEND_API_URI
    const response = await axios.get(`${baseURL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

const AddTransformationTypePage = () => {
  
  const navigate = useNavigate();
  const { userId } = useAuth()  
  const [user, setUser] = useState(null);

  const { type } = useParams()
  const tranformation = transformationTypes[type]
  
  useEffect(() => {
    if (!userId) return navigate("/sign-in", { replace: true })

    if(!user)
    fetchUserData(userId)
      .then(userData => setUser(userData))
      .catch(() => navigate("/sign-in"));
  }, [userId, navigate, user]);

  if (!userId || !user) return null;
  
  return (
    <>
      <Header title={tranformation.title} subtitle={tranformation.subTitle} />

      <section className="mt-10">
        <TransformationForm action="Add" userId={user._id} type={tranformation.type} creditBalance={user.creditBalance} />
      </section>
    </>
  )
}

export default AddTransformationTypePage