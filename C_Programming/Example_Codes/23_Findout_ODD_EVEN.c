#include<stdio.h>
void find (int n);
int main(void)
{
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    find (num);
    return 0;
}
void find (int n)
{
    if(n%2==0)
    printf("The number is even!", n);
    else
    printf("The number is odd", n );

}