import { memo, useState } from 'react'

import Skeleton from 'react-loading-skeleton'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { THeader } from '../THeader/THeader.tsx'
import { TRow } from '../TRow/TRow.tsx'

import s from './TableDecks.module.scss'

import deckImg from '@/assets/img/deckImage.jpg'
import { ReactComponent as EditIcon } from '@/assets/svg/edit.svg'
import { ReactComponent as PlayIcon } from '@/assets/svg/play.svg'
import { ReactComponent as TrashIcon } from '@/assets/svg/trash.svg'
import { Typography, TypographyVariant } from '@/components/ui'
import { ConfirmModal } from '@/components/ui/ConfirmModal/ConfirmModal.tsx'
import { useMeQuery } from '@/services/auth/authApi.ts'
import { cardsActions } from '@/services/cards'
import { useDeleteDeckMutation, useUpdateDeckMutation } from '@/services/decks'
import { decksActions } from '@/services/decks/decksSlice.ts'
import { CreateDeckArgs, Deck, SortByType } from '@/services/decks/types.ts'
import { useAppDispatch } from '@/services/store.ts'
import { decksHeaderColumns } from '@/utils/constants'
import { AddNewPackValues } from '@/widgets/AddNewPack/model/types/types.ts'
import { EditPack } from '@/widgets/EditPack/EditPack.tsx'
import { TCell } from '@/widgets/Table/TCell/TCell.tsx'
import 'react-loading-skeleton/dist/skeleton.css'

interface TableProps {
  data?: Deck[]
  sortBy: SortByType | ''
  isFetching: boolean
}

export const TableDecks = memo(({ data, sortBy, isFetching }: TableProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [deleteDeck, { isLoading: isLoadingDelete }] = useDeleteDeckMutation()
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
  const [isOpenEditDeck, setIsOpenEditDeck] = useState(false)
  const [deckId, setDeckId] = useState('')
  const [deckCoverImg, setDeckCoverImg] = useState('')
  const [deckName, setDeckName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const { data: authMeData } = useMeQuery()
  const [updateDeck] = useUpdateDeckMutation()

  const handleLinkToCardsClick = (cover: string | null, id: string, nameDeck: string) => {
    dispatch(decksActions.setDeckCover(cover))
    dispatch(decksActions.setAuthorId(id))
    dispatch(decksActions.setDeckName(nameDeck))
    dispatch(cardsActions.setCurrentPage(1))
  }

  const handleDeleteDeck = async (id: string) => {
    toast
      .promise(deleteDeck({ id }).unwrap(), {
        pending: 'Deleting...',
        success: `The ${deckName} was successfully deleted`,
        error: `The ${deckName} was not deleted`,
      })
      .then(() => {
        localStorage.clear()
        setIsOpenConfirmModal(false)
      })
  }
  const handleClickDeleteDeck = (id: string, nameDeck: string) => {
    setIsOpenConfirmModal(true)
    setDeckId(id)
    setDeckName(nameDeck)
  }
  const handlePlay = (deckId: string, nameDeck: string, cardsCount: number) => {
    if (cardsCount) {
      navigate(`/decks/${deckId}/learn`)
      dispatch(decksActions.setDeckName(nameDeck))
    } else {
      toast.warning('Sorry, the deck is still empty. Please choose a deck with available cards.')
    }
  }

  const handleClickToEditDeck = (id: string, name: string, isPrivate: boolean, cover: string) => {
    setDeckId(id)
    setDeckCoverImg(cover)
    setDeckName(name)
    setIsPrivate(isPrivate)
    setIsOpenEditDeck(prev => !prev)
  }

  const onSubmitEditDeck = ({ name, isPrivate, cover }: AddNewPackValues) => {
    const formData = new FormData()

    formData.append('name', name)
    formData.append('isPrivate', String(isPrivate))
    cover[0] && formData.append('cover', cover[0])

    toast
      .promise(
        updateDeck({ id: deckId, formData: formData as unknown as CreateDeckArgs }).unwrap(),
        {
          pending: 'Updating...',
          success: `The ${deckName} was successfully updated`,
          error: `The ${deckName} was not updated`,
        }
      )
      .then(() => {
        setIsOpenEditDeck(prev => !prev)
      })
      .catch(e => toast.error(e.data.message))
  }

  return (
    <table className={s.table}>
      {isOpenEditDeck && (
        <EditPack
          isOpen={isOpenEditDeck}
          onClose={setIsOpenEditDeck}
          onSubmit={onSubmitEditDeck}
          deckName={deckName}
          isPrivate={isPrivate}
          deckCoverImg={deckCoverImg}
        />
      )}
      <ConfirmModal
        title="Delete Pack"
        isOpen={isOpenConfirmModal}
        setIsOpen={setIsOpenConfirmModal}
        onAction={() => handleDeleteDeck(deckId)}
        isLoading={isLoadingDelete}
      >
        <p>
          Do you really want to remove <span className={s.nameDeck}>{deckName}</span>?
        </p>
        <p>All cards will be deleted. </p>
      </ConfirmModal>
      <THeader
        sortBy={sortBy}
        columns={decksHeaderColumns}
        setSortBy={sortBy => dispatch(decksActions.setSortBy(sortBy))}
      />
      <tbody>
        {data?.map(({ id, cover, name, cardsCount, updated, author, isPrivate }) => {
          return (
            <TRow key={id}>
              <TCell>
                <Link
                  className={s.deckName}
                  to={`/cards/${id}`}
                  onClick={() => handleLinkToCardsClick(cover, author.id, name)}
                >
                  <div className={s.deckImg}>
                    {isFetching ? (
                      <Skeleton width={120} height={44} />
                    ) : (
                      <img src={cover ? cover : deckImg} alt="deck" className={s.img} />
                    )}
                  </div>
                  {isFetching ? (
                    <Skeleton width={200} height={40} />
                  ) : (
                    <div className={s.title}>
                      <Typography variant={TypographyVariant.Body2}>{name}</Typography>
                    </div>
                  )}
                </Link>
              </TCell>

              <TCell>
                {isFetching ? (
                  <Skeleton width={24} height={24} />
                ) : (
                  <Typography variant={TypographyVariant.Body2}>{cardsCount}</Typography>
                )}
              </TCell>
              <TCell>
                {isFetching ? (
                  <Skeleton width={75} height={24} />
                ) : (
                  <Typography tag="span" variant={TypographyVariant.Body2}>
                    {new Date(updated).toLocaleDateString('en-GB')}
                  </Typography>
                )}
              </TCell>
              <TCell>
                {isFetching ? (
                  <Skeleton width={180} height={24} />
                ) : (
                  <Typography tag="span" variant={TypographyVariant.Body2}>
                    {author.name}
                  </Typography>
                )}
              </TCell>
              {isFetching ? (
                <Skeleton width={75} height={24} />
              ) : (
                <TCell>
                  <PlayIcon onClick={() => handlePlay(id, name, cardsCount)} />
                  {authMeData?.id === author.id && (
                    <EditIcon onClick={() => handleClickToEditDeck(id, name, isPrivate, cover!)} />
                  )}
                  {authMeData?.id === author.id && (
                    <TrashIcon onClick={() => handleClickDeleteDeck(id, name)} />
                  )}
                </TCell>
              )}
            </TRow>
          )
        })}
      </tbody>
    </table>
  )
})
