// SPA
/*
 Estratégia de requisições mais comum para SPA's 
 o problema é que crawlers responsaveis por indexar conteúdo
 ainda não vão enxergar este conteudo pois ele pode demorar
 um tempo para ser exibidos em tela
*/
// import { useEffect } from "react"

// export default function Home() {
//   useEffect(() => {
//     fetch('http://localhost:3333/episodes')
//       .then(response => response.json())
//       .then(data => console.log(data))
//   }, [])

//   return <h1>Index</h1>
// }


// SSR
/*
  Este formato de requisição utilizando o SSR do Nextjs com o getServerSideProps
  nos possibilita realizar requisições a uma api como no exemplo anterior, mas
  a diferença é que o servidor node do next fica com esses dados das requisições
  e entrega junto com o a interface, ou seja, mesmo se disabilitarmos o javascript
  do navegador os dados continuarão a serem exibidos na nossa interface. 
  O getServerSideProps é executado toda vez que alguem executar a Home da nossa aplicação 
*/

// export default function Home(props) {
//   // console.log(props.episodes)

//   return (
//     <div>
//       <h1>Index</h1>
//       <p>{JSON.stringify(props.episodes)}</p>
//     </div>
//   )
// }

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data
//     }
//   }
// }


// SSG
/*
  Neste formato com o getStaticProps as nossas páginas são geradas de forma
  totalmente estáticas, mas com uma estratégia de revalidação (que em um determinado tempo)
  irá atualizar os nossos dados com uma nova requisição e gerando assim uma nova página
*/
export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },

    revalidate: 60 * 60 * 8,
  }
}