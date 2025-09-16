import { Person, Actress } from "./type"



function isActress(data: unknown): data is Actress {
  if (data && typeof data === 'object' && data !== null &&
    "id" in data && typeof data.id === 'number' &&
    "name" in data && typeof data.name === 'string' &&
    "birth_year" in data && typeof data.birth_year === 'number' &&
    "death_year" in data && typeof data.death_year === 'number' &&
    "biography" in data && typeof data.biography === 'string' &&
    "image" in data && typeof data.image === 'string' &&
    "most_famous_movies" in data && data.most_famous_movies instanceof Array && data.most_famous_movies.length === 3 && data.most_famous_movies.every(movie => typeof movie == 'string') &&
    "awards" in data && typeof data.awards === 'string' &&
    "nationality" in data && typeof data.nationality === 'string'
  ) {
    return true
  }
  return false
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`)
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`)
    }
    const data: unknown = await response.json()
    if (!isActress(data)) {
      throw new Error(`Formato dei dati non valido}`)
    }
    return data

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return null
  }

}

async function getAllActress(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`)
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`)
    }
    const data: unknown = await response.json()
    if(!(data instanceof Array)){
      throw new Error(`Formato dei dati non valido}`)
    }
    const validActress: Actress[] = data.filter((a)=> isActress(a))
    return validActress

  } catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return []
  }
}

async function getActresses(ids:number[]): Promise<(Actress | null)[]> {
  try{
    const promises = ids.map(id => getActress(id))
    return await Promise.all(promises)
  }catch (error) {
    if (error instanceof Error) {
      console.error('Errore durante il recupero dei dati:', error)
    } else {
      console.error('Errore sconosciuto:', error)
    }
    return []
  }
  
}