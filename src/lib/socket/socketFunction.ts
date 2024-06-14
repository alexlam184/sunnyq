import { socket } from '@src/lib/socket/socket';
import { MESSAGE } from '../message';
import { useGameStore } from '@/store/zustand/GameStore';

function handleSocket(
  messageName: MESSAGE,
  handler: (data: any) => void,
  errHandler: (data: any) => void
) {
  socket.on(messageName, function (data: any) {
    if (data.err) {
      console.warn(data.err);
      if (errHandler) {
        errHandler(data.err);
      }
      return;
    }

    if (handler) handler(data);

    if (data.roomState !== undefined) {
      const { setGameState } = useGameStore();
      setGameState(data.roomState);
    }
  });
}
//TODO:
// handleSocket(
//   MESSAGE.CREATE_ROOM,
//   function (data) {
//     Store.setUsername(data.username);
//   },
//   function (errMsg) {
//     Store.setWarning('createWarning', errMsg);
//   }
// );
// handleSocket(
//   MESSAGE.JOIN_ROOM,
//   function (data) {
//     if (data.username !== Store.state.username) {
//       return;
//     }
//     Store.setWarning('joinWarning', undefined);
//     if (data.rejoin === true) {
//       console.log('Game reconnect success');
//     }
//   },
//   function (errMsg) {
//     Store.setWarning('joinWarning', errMsg);
//   }
// );
// handleSocket(MESSAGE.LEAVE_ROOM, function (data) {
//   // let the socket disconnect handler take care of the rest
//   // Store.setGameState(undefined);
// });
// handleSocket(MESSAGE.USER_LEFT);
// handleSocket(MESSAGE.START_GAME);
// handleSocket(MESSAGE.NEW_TURN);
// handleSocket(MESSAGE.RETURN_TO_SETUP);

//TODO:
// socket.on('disconnect', function () {
// 	Store.state.gameConnection = CONNECTION_STATE.DISCONNECT;
// 	let existingGameState = Store.state.gameState;
// 	if (existingGameState) {
// 		let me = existingGameState.findUser(Store.state.username);
// 		switch (existingGameState.phase) {
// 			case GAME_PHASE.SETUP:
// 				// if user was in room setup, just forget about the gamestate altogether
// 				// No need to handle reconnection, user should just join the room normally again
// 				Store.setGameState(undefined);
// 				break;
// 			case GAME_PHASE.PLAY:
// 			case GAME_PHASE.VOTE:
// 				if (me) {
// 					me.connected = false;
// 				}
// 				break;
// 			default:
// 				console.warn('Bad gamestate');
// 				break;
// 		}
// 	}
// });
// socket.on('connect', reconnectToGame);
// socket.on('reconnect', reconnectToGame);
// function reconnectToGame() {
// 	let existingGameState = Store.state.gameState;
// 	let username = Store.state.username;
// 	if (
// 		existingGameState &&
// 		username &&
// 		Store.state.gameConnection === CONNECTION_STATE.DISCONNECT
// 	) {
// 		Store.state.gameConnection = CONNECTION_STATE.RECONNECT;
// 		console.log('Attempting game rejoin.');
// 		socket.emit(MESSAGE.JOIN_ROOM, {
// 			roomCode: existingGameState.roomCode,
// 			username: username,
// 		});
// 	}
// }
// window.faodbg = {
// 	dcon() {
// 		socket.disconnect();
// 	},
// 	con() {
// 		socket.connect();
// 	},
// };
