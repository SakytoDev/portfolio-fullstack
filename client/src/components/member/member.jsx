import accIcon from '../../assets/images/defaultAcc.png';

export default function MemberObj({ nickname }) {
    return (
        <div className='flex items-center border rounded-xl mb-2 p-2'>
            <img className='w-8 h-8' src={accIcon}/>
            <p className='ms-2 text-lg font-semibold'>{nickname}</p>
        </div>
    )
}