const addressToBytes = (address: string) => {
  return '0x' + '000000000000000000000000' + address.replace('0x', '');
};

export default addressToBytes;
