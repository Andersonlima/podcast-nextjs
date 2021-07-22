import { GetStaticProps } from "next"
import Image from 'next/image'
import Link from 'next/link'
import Head from "next/head"
import { parseISO } from 'date-fns'

import styles from './home.module.scss'
import { api } from "../services/api"
import { formatDate } from '../utils/formatDate'
import { convertDurationToString } from "../utils/convertDurationToString"
import { useContext } from "react"
import { PlayerContext } from "../contexts/PlayerContext"

type Episode = {  
  id: string;
  title: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
}

type HomeProps = {
  latest: Episode[],
  allEpisodes: Episode[]
}

export default function Home({ latest, allEpisodes }: HomeProps) {
  const { playList } = useContext(PlayerContext)
  
  const episodeList = [...latest, ...allEpisodes]

  return (
    <div className={styles.homepage}>

      <Head>
        <title>Home | Podcastr</title>
      </Head>
      
      <section className={styles.latest}>
        <h2>Últimos lançamentos</h2>

        <ul>
        {
          latest.map((episode, index) => (
            <li key={ episode.id }>
              <Image 
                width={192} height={192} 
                src={ episode.thumbnail } 
                alt={ episode.title } 
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{ episode.title }</a>
                </Link>
                <p>{ episode.members }</p>
                <span>{ episode.publishedAt }</span>
                <span>{ episode.durationAsString }</span>
              </div>

              <button 
                type="button" 
                onClick={() => playList(episodeList, index)} >
                <img src="/play-green.svg" alt="Tocar episódio" title="Tocar" />                
              </button>
            </li>
          ))
        }
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>
        
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {
            allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td style={{width: 72}}>
                  <Image 
                    width={120} height={120}
                    src={ episode.thumbnail } 
                    alt={ episode.title } 
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${ episode.id }`}>
                    <a>{ episode.title }</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{width: 90}}>{episode.publishedAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button 
                    type="button"
                    onClick={() => playList(episodeList, index + latest.length)}
                  >
                    <img src="/play-green.svg" alt="Tocar episódio" />
                  </button>
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async() => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  }) 

  const episodes = data.map(episode => {
    return {
      ...episode,
      publishedAt: formatDate(parseISO(episode.published_at)),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latest = episodes.slice(0, 2); // pega somente 2 episódios
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latest,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}
