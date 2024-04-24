import { navLinks } from "@/constants"
import axios from "axios";
import { Link } from "react-router-dom";
import { Collection } from "./Collection";
const baseURL = import.meta.env.VITE_BACKEND_API_URI;


const Home = ({ searchParams }) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query) || '';

  const images = axios.post(`${baseURL}/images/allImage`,{ page, searchQuery})

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with Imagi
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <img src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  )
}

export default Home