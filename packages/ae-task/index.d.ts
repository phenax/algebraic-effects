
interface Task<ErrType, AType> {
  fork: (failure: (e: ErrType) => any, success: (a: AType) => any) => any,
}

declare module TaskModule {}

export default Task;


