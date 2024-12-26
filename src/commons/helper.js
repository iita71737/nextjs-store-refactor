export const formatPrice = cents => {
    //console.log(cents)
    return (cents / 27.87).toLocaleString('zh', {
        style: 'currency',
        currency: 'TWD'
    });
};