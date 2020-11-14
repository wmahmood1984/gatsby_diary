import React from "react"
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";

const BookMarksQuery = gql`{
  bookmark{
    id
    url
    desc
  }
}`

const AddBookMarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String! ){
    addBookmark(url:$url, desc:$desc){
      url
    }
  }
`

export default function Home() {
  const {loading,error,data} = useQuery(BookMarksQuery)
  const [addBookmark] = useMutation(AddBookMarkMutation)
  let textfield;
  let desc;
  const addBookMarkSubmit = ()=>{
    addBookmark({
      variables:{
        url: textfield.value,
        desc: desc.value
      },
      refetchQueries:[{query:BookMarksQuery}],
    })
    console.log("textfield",textfield.value)
    console.log("description",desc.value)
  }
   return (
     <div>
   <p>{JSON.stringify(data)}</p>
       <div>
         <input type="text" placeholder = "URL" ref={node => textfield = node}></input>
         <input type="text" placeholder = "Description" ref={node => desc = node}></input>
       <button onClick={addBookMarkSubmit}>Add BookMark</button>
       </div>
       </div>
 
   )
   
 }