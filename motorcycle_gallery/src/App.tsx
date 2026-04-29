import { useState, useEffect } from "react"
import bike1 from "./images/bike1.jpg"
import bike2 from "./images/bike2.jpg"
import bike3 from "./images/bike3.png"
import bike4 from "./images/bike4.jpg"
import bike5 from "./images/bike5.avif"
import bike6 from "./images/bike6.webp"
import bike7 from "./images/bike7.webp"
import bike8 from "./images/bike8.avif"

type Comment = {
  id: number
  text: string
  createdAt: number
  likes: number
  bikeIndex: number
}

function App() {
  const bikes = [
    {
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000"
    },
    {
      image:
        bike1
    },
    {
      image:
        bike2
    },
    {
      image:
        bike3
    },
    {
      image:
        bike4
    },
    {
      image:
        bike5
    },
    {
      image:
        bike6
    },
    {
      image:
        bike7
    },
    {
      image:
        bike8
    }
  ]

  const [activeSection, setActiveSection] = useState(
    localStorage.getItem("section") || "home"
  )
  const [currentIndex, setCurrentIndex] = useState(
  Number(localStorage.getItem("currentIndex")) || 0
)

const [likes, setLikes] = useState<number[]>(
  JSON.parse(
    localStorage.getItem("likes") ||
      JSON.stringify(new Array(bikes.length).fill(0))
  )
)

const [comment, setComment] = useState("")

const [comments, setComments] = useState<Comment[]>(
  JSON.parse(localStorage.getItem("comments") || "[]")
)

const [commentSort, setCommentSort] = useState(
  localStorage.getItem("commentSort") || "oldest"
)

useEffect(() => {
  localStorage.setItem("section", activeSection)
}, [activeSection])

useEffect(() => {
  localStorage.setItem(
    "currentIndex",
    currentIndex.toString()
  )
}, [currentIndex])

useEffect(() => {
  localStorage.setItem(
    "likes",
    JSON.stringify(likes)
  )
}, [likes])

useEffect(() => {
  localStorage.setItem(
    "comments",
    JSON.stringify(comments)
  )
}, [comments])

useEffect(() => {
  localStorage.setItem(
    "commentSort",
    commentSort
  )
}, [commentSort])

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === bikes.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? bikes.length - 1 : prev - 1
    )
  }

  const likeImage = () => {
    const updated = [...likes]
    updated[currentIndex] += 1
    setLikes(updated)
  }

  const addComment = () => {
    if (!comment.trim()) return

    const newComment: Comment = {
      id: Date.now(),
      text: comment,
      createdAt: Date.now(),
      likes: 0,
      bikeIndex: currentIndex
    }

    setComments([...comments, newComment])
    setComment("")
  }

  const likeComment = (id: number) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, likes: c.likes + 1 } : c
      )
    )
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (commentSort === "newest")
      return b.createdAt - a.createdAt

    if (commentSort === "mostLiked")
      return b.likes - a.likes

    if (commentSort === "mostLikedPhoto")
      return likes[b.bikeIndex] - likes[a.bikeIndex]

    return a.createdAt - b.createdAt
  })

  return (
    <div className="app">
      <nav className="navbar">
        <button onClick={() => setActiveSection("home")}>
          Home
        </button>

        <button onClick={() => setActiveSection("gallery")}>
          Gallery
        </button>

        <button onClick={() => setActiveSection("comments")}>
          Comments
        </button>
        <button onClick={() => {
          localStorage.clear()
          window.location.reload()
          }}
        >
          Reset
        </button>
      </nav>

      {activeSection === "home" && (
        <div className="home">
          <h1>Motorcycle Art Gallery</h1>

          <img
            src={bikes[0].image}
            alt="hero"
            className="hero-image"
          />
        </div>
      )}

      {activeSection === "gallery" && (
        <div className="gallery">
          <h2>Gallery</h2>

          <img
            src={bikes[currentIndex].image}
            alt="bike"
            className="gallery-image"
          />

          <div>
            <button onClick={prevImage}>
              ⬅ Previous
            </button>

            <button onClick={nextImage}>
              Next ➡
            </button>
          </div>

          <button onClick={likeImage}>
            ❤️ Like ({likes[currentIndex]})
          </button>

          <div className="comment-box">
            <input
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write comment..."
            />

            <button onClick={addComment}>
              Add Comment
            </button>
          </div>
        </div>
      )}

      {activeSection === "comments" && (
        <div className="comments-section">
          <h2>All Comments</h2>

          <select
            value={commentSort}
            onChange={(e) =>
              setCommentSort(e.target.value)
            }
          >
            <option value="oldest">
              Oldest
            </option>

            <option value="newest">
              Newest
            </option>

            <option value="mostLiked">
              Most Liked Comments
            </option>

            <option value="mostLikedPhoto">
              Most Liked Photo
            </option>
          </select>

          {sortedComments.map((c) => (
            <div
              key={c.id}
              className="comment-card"
            >
              <img
                src={bikes[c.bikeIndex].image}
                alt="bike"
              />

              <p>{c.text}</p>

              <button
                onClick={() =>
                  likeComment(c.id)
                }
              >
                ❤️ {c.likes}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App