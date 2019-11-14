

  import styled from "styled-components"

  const PhotoGrid = styled.section`
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    overflow: auto;
  
    h1, h2 {
        z-index: 100;
        color: #f0f3f9;
        font-weight: bold;

    }
  
  `
  
  export default PhotoGrid
  