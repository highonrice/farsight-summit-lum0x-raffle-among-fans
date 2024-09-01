/** @jsxImportSource frog/jsx */
import { url } from 'inspector'
import { Box } from '../api/[[...routes]]/ui'
import { fontSizes } from 'frog/_lib/ui/vars'

export function getShareImage(
    ranks: number,
    score: number,
    reactions: number,
    recasts: number,
    displayName: string,
    pfpUrl: string
) {
    let ranksStr = '#' + ranks
    return (
        <Box
            grow
            alignVertical="center"
            padding="10"
            paddingBottom="26"
            marginTop="2"
            marginBottom="2"
            // fontWeight="700"
            position='relative'
        >
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 700,
                    left: 0,
                    width: '100%',
                }}
            >
                <img src="/Share.png"/>
            </div> 
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 750,
                    left: 40,
                    width: '100%',
                    color: 'white',
                    fontSize: 54,
                    fontFamily: 'coinbase',
                }}
            >
                {`${displayName} won the raffle! 🥳`}
            </div> 
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 970,
                    left: 245,
                    width: '28%',
                    fontFamily: 'Poppins',
                }}
            >
                <img 
                    src={pfpUrl}
                    width={150}
                    height={150}
                    style={{
                        borderRadius: '60%',
                    }}
                />
            </div>
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 950,
                    left: 491,
                    width: '100%',
                    color: 'white',
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: 'coinbase',
                }}
            >
                {`${ranksStr}`}
            </div> 
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 950,
                    left: 656,
                    width: '100%',
                    color: 'white',
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: 'coinbase',
                }}
            >
                {`${score}`}
            </div> 
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 1100,
                    left: 498,
                    width: '100%',
                    color: 'white',
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: 'coinbase',
                }}
            >
                {`${recasts}`}
            </div> 
            <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    top: 1100,
                    left: 679,
                    width: '100%',
                    color: 'white',
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: 'coinbase',
                }}
            >
                {`${reactions}`}
            </div> 
        </Box>
    )
}

// function _renderFanData(topTen: Fan[]) {
//     return (
//         <div
//             style={{
//                 position: 'absolute',
//                 display: 'flex',
//                 top: 0,
//                 left: 320,
//                 width: '28%',
//                 color: 'darkPurple',
//                 fontSize: 15,
//                 fontWeight: 900,
//                 fontFamily: 'Poppins',
//             }}
//         >
            
//             {topTen.slice(0, 10).map((fan, index) => (
//                 <div
//                     style={{
//                         display: 'flex',
//                     }}
//                 >
//                     <div
//                         style={{
//                             display: 'flex',
//                         }}
//                     >
//                         <div
//                             key={index}
//                             style={{
//                                 position: 'absolute',
//                                 display: 'flex',
//                                 top: `${835 + index * 37}px`,
//                             }}
//                         >
//                             {'@' + fan.display_name}
//                         </div>
//                         <div
//                             key={index}
//                             style={{
//                                 position: 'absolute',
//                                 display: 'flex',
//                                 top: `${835 + index * 37}px`,
//                                 left: '370',
//                             }}
//                         >
//                             {fan.score}
//                         </div>
//                     </div>
//                     <div
//                         style={{
//                             display: 'flex',
//                         }}
//                     >
//                         <div
//                             key={index}
//                             style={{
//                                 position: 'absolute',
//                                 display: 'flex',
//                                 top: `${835 + index * 37}px`,
//                                 left: '475',
//                             }}
//                         >
//                             {fan.recasts}
//                         </div>
//                         <div
//                             key={index}
//                             style={{
//                                 position: 'absolute',
//                                 display: 'flex',
//                                 top: `${835 + index * 37}px`,
//                                 left: '580',
//                             }}
//                         >
//                             {fan.reactions}
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     )
    
// }