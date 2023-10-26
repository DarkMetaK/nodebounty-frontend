import React, { useState, useEffect } from 'react'
import { Button } from '@components/Button'
import { CreditCard } from '@components/CreditCard'
import { Loading } from '@components/Loading'
import styles from './styles.module.css'
import { api } from '@lib/api.js'

export function CreditCardPage() {
  const [cartoes, setCartoes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [cardToDelete, setCardToDelete] = useState(null)

  useEffect(() => {
    const consulta = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get('/cartoes')
        setCartoes(data)
      } catch (error) {
        alert('Um erro ocorreu, por favor tente novamente')
        setErro(error.message)
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    consulta()
  }, [])

  async function GerarCartao() {
    console.log('Tentando gerar cartão...')

    try {
      const { data } = await api.post('/cartoes')
      setCartoes((cartoes) => [...cartoes, data])
    } catch (error) {
      alert('Um erro ocorreu, por favor tente novamente')
      setErro(error.message)
      console.log(error)
    }
  }

  async function deletarCartao(idCartaoDeletar) {
    // Set the card ID to be deleted in the state
    setCardToDelete(idCartaoDeletar)
  }

  // Use a confirmation dialog before deleting
  useEffect(() => {
    if (cardToDelete !== null) {
      const isConfirmed = window.confirm(
        'Você realmente deseja deletar esse cartão?',
      )
      if (isConfirmed) {
        // User confirmed, delete the card
        async function deleteConfirmedCard() {
          try {
            const { data } = await api.delete(`/cartoes/${cardToDelete}`)
            setCartoes((cartoes) =>
              cartoes.filter((cartao) => cartao.idCartao !== cardToDelete),
            )
          } catch (error) {
            alert('Um erro ocorreu, por favor tente novamente')
            setErro(error.message)
            console.log(error)
          }
        }
        deleteConfirmedCard()
      }
      // Reset the cardToDelete state
      setCardToDelete(null)
    }
  }, [cardToDelete])

  return isLoading ? (
    <Loading />
  ) : (
    <div className="container">
      <div>
        {cartoes.map((cartao) => (
          <div key={cartao.idCartao}>
            <CreditCard
              numeroCartao={cartao.numeroCartao}
              validadeCartao={cartao.validadeCartao}
              cvcCartao={cartao.cvcCartao}
            />
            <div className="row justify-content-center mt-1">
              <div className="col-2 text-left">
                <Button
                  id={cartao.idCartao}
                  titulo="Deletar Cartão"
                  onClick={() => deletarCartao(cartao.idCartao)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {erro && <p>Erro na consulta: {erro}</p>}

      <div className="row justify-content-center mt-1">
        <div className={'col-md-auto' + styles.cartao}>
          <div className={styles.cartao}>
            <Button
              titulo="Gerar Cartão"
              onClick={GerarCartao}
              tipo="secundario"
            />
          </div>
        </div>
        <div className="elementos-container"></div>
      </div>
    </div>
  )
}
